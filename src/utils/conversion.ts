import { Repository } from 'typeorm';
import { AppBaseEntity } from '@/models/appBaseEntity';

export type FieldsConversion = Record<string, (value: any) => any>;

export type ConvertParams<Model extends AppBaseEntity> = {
    addOnlyTruthy?: boolean;
    attrs: Record<string, any>;
    repository: Repository<Model>;
    fieldsConversion: FieldsConversion;
};

const getType = (value: any) => {
    if (value === null) return 'null';

    if (value instanceof Date) return 'date';

    return typeof value;
};

export type FormDataConversionMap = Partial<
    Record<ReturnType<typeof getType>, (value: any) => any>
>;

const formDataTypeConversion: FormDataConversionMap = {
    date: (value: Date) => value.toISOString(),
    number: (value: number) => `${value}`,
    boolean: (value: boolean) => value,
    null: (value: null) => value,
    undefined: (value: undefined) => value,
};

export const stringToFloat = (value: string) => parseFloat(value);

export const convertAttributes = <Model extends AppBaseEntity>({
    attrs,
    repository,
    fieldsConversion,
    addOnlyTruthy = true,
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
        if (!addOnlyTruthy || (addOnlyTruthy && !!value)) {
            const convertedValue = fieldsConversion[field]
                ? fieldsConversion[field](value)
                : value;

            newAttrs[field] = convertedValue;
            apiAttrs[columnNamesMap[field]] = convertedValue;
        }
    });

    return [newAttrs, apiAttrs] as [Record<string, any>, Record<string, any>];
};

export const instanceToObject = <Model extends AppBaseEntity>(
    instance: Model & Record<string, any>,
    repository: Repository<Model>,
    fieldsConversion?: FormDataConversionMap
) => {
    const attrs = {} as Record<string, any>;
    const conversionMap = {
        ...formDataTypeConversion,
        ...(fieldsConversion || {}),
    };

    repository.metadata.columns.forEach((column) => {
        const field = column.propertyName;
        const value = instance[field];
        const type = getType(value);

        const convertionFunc = conversionMap[type];

        attrs[field] = convertionFunc ? convertionFunc(value) : `${value}`;
    });

    return attrs;
};
