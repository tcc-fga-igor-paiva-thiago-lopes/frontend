import { Repository } from 'typeorm';
import { AppBaseEntity } from '@/models/appBaseEntity';

export type FieldsConversion = Record<string, (value: any) => any>;

export type ConvertParams<Model extends AppBaseEntity> = {
    attrs: Record<string, any>;
    repository: Repository<Model>;
    fieldsConversion: FieldsConversion;
};

export const stringToFloat = (value: string) => parseFloat(value);

export const convertAttributes = <Model extends AppBaseEntity>({
    attrs,
    repository,
    fieldsConversion,
}: ConvertParams<Model>) => {
    const newAttrs = {} as Record<string, any>;
    const apiAttrs = {} as Record<string, any>;

    const columnNamesMap = Object.fromEntries(
        repository.metadata.columns.map((column) => [
            column.propertyName,
            column.databaseName,
        ])
    );

    Object.entries(attrs).forEach(([field, value]) => {
        const convertedValue = fieldsConversion[field]
            ? fieldsConversion[field](value)
            : value;

        newAttrs[field] = convertedValue;
        apiAttrs[columnNamesMap[field]] = convertedValue;
    });

    return [newAttrs, apiAttrs] as [Record<string, any>, Record<string, any>];
};
