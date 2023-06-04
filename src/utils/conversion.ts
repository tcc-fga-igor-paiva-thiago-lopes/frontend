import { Repository } from 'typeorm';
import { AppBaseEntity } from '@/models/appBaseEntity';

export type FieldsConversion = Record<string, (value: any) => any>;

export type ConvertParams<Model extends AppBaseEntity> = {
    addOnlyTruthy?: boolean;
    attrs: Record<string, any>;
    repository: Repository<Model>;
};

const getType = (value: any) => {
    if (value === null) return 'null';

    if (value instanceof Date) return 'date';

    return typeof value;
};

const convertFormDataToType = (type: any, value: any) => {
    const valueIsString = typeof value === 'string';

    switch (type) {
        case Date:
        case 'datetime':
            return valueIsString ? value : value.toISOString();
        case Number:
            return value.toString();
        case String:
        case Boolean:
        default:
            return value;
    }
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

export const formDataToDatabaseAndApi = <Model extends AppBaseEntity>({
    attrs,
    repository,
    addOnlyTruthy = true,
}: ConvertParams<Model>) => {
    const newAttrs = {} as Record<string, any>;
    const apiAttrs = {} as Record<string, any>;

    const columnNamesMap = Object.fromEntries(
        repository.metadata.columns.map(
            ({ propertyName, databaseName, type }) => [
                propertyName,
                { databaseName, type },
            ]
        )
    );

    Object.entries(attrs).forEach(([field, value]) => {
        if (!addOnlyTruthy || (addOnlyTruthy && !!value)) {
            const convertedValue = convertFormDataToType(
                columnNamesMap[field].type,
                value
            );

            newAttrs[field] = convertedValue;
            apiAttrs[columnNamesMap[field].databaseName] = convertedValue;
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
