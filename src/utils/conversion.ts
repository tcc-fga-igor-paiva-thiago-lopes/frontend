import { Repository } from 'typeorm';

import { formatISO } from './date';
import { AppBaseEntity } from '@/models/appBaseEntity';
import { SyncableEntity } from '@/models/syncableEntity';

export type ModelClass<T> = { new (): T } & typeof SyncableEntity;

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
    const valueIsNumber = typeof value === 'number';

    switch (type) {
        case Date:
        case 'datetime':
            return valueIsString ? value : formatISO(value);
        case 'decimal':
        case Number:
            return valueIsNumber ? value : parseFloat(value);
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
    date: (value: Date) => formatISO(value),
    number: (value: number) => `${value}`,
    boolean: (value: boolean) => value,
    null: (value: null) => value,
    undefined: (value: undefined) => value,
};

const getColumnNamesMap = <Model extends AppBaseEntity>(
    repository: Repository<Model>
) => {
    return Object.fromEntries(
        repository.metadata.columns.map(
            ({
                propertyName,
                databaseName,
                type,
                referencedColumn,
                relationMetadata,
            }) => [
                propertyName,
                {
                    databaseName,
                    type,
                    isRelationship: !!referencedColumn,
                    relationModel:
                        relationMetadata?.type as typeof SyncableEntity,
                },
            ]
        )
    );
};

export const convertDatabaseToApi = (type: any, value: any) => {
    if (value === null || value === undefined) return null;

    switch (type) {
        case Date:
        case 'datetime':
            return formatISO(value);
        default:
            return value;
    }
};

export const stringToFloat = (value: string) => parseFloat(value);

export const formDataToDatabaseAndApi = <Model extends AppBaseEntity>({
    attrs,
    repository,
    addOnlyTruthy = true,
}: ConvertParams<Model>) => {
    const newAttrs = {} as Record<string, any>;
    const apiAttrs = {} as Record<string, any>;

    const columnNamesMap = getColumnNamesMap(repository);

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

export const multipleDatabaseToApi = async <Model extends AppBaseEntity>(
    model: ModelClass<Model>,
    records: Model[],
    toRemoveFields: string[] = [
        'id',
        'synced',
        'createdAt',
        'updatedAt',
        'deletedAt',
    ]
) => {
    const repository = model.getRepository<Model>();
    const columnNamesMap = getColumnNamesMap(repository);

    const relationModels = repository.metadata.columns
        .map((col) => col.relationMetadata?.type)
        .filter((klass) => !!klass) as (typeof SyncableEntity)[];

    const idToIdentifiers = Object.fromEntries(
        await Promise.all(
            relationModels.map(async (entity) => [
                entity.name,
                await entity.idToIdentifiersMap(),
            ])
        )
    );

    return records.map((record) => {
        return Object.fromEntries(
            Object.entries(record)
                .filter(
                    ([field]) =>
                        !toRemoveFields.includes(field) &&
                        !!columnNamesMap[field]
                )
                .map(([field, value]) => {
                    const {
                        type,
                        databaseName,
                        isRelationship,
                        relationModel,
                    } = columnNamesMap[field];

                    if (isRelationship) {
                        return [
                            databaseName.replace('_id', '_identifier'),
                            idToIdentifiers[relationModel.name][value],
                        ];
                    }

                    return [databaseName, convertDatabaseToApi(type, value)];
                })
        );
    });
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
