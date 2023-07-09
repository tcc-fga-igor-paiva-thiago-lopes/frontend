import {
    Like,
    Equal,
    MoreThan,
    LessThan,
    BaseEntity,
    MoreThanOrEqual,
    LessThanOrEqual,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { formatISO, parseISO } from '@/utils/date';

export type StaticThis<T> = { new (): T } & typeof BaseEntity;
export interface IAppBaseEntity extends Record<string, any> {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
}

export type FilterDataType =
    | 'includes'
    | 'starts_with'
    | 'ends_with'
    | 'less_than'
    | 'equals_to'
    | 'greater_than'
    | 'greater_than_or_equal'
    | 'less_than_or_equal';

export interface IFilterData {
    value: any;
    type: FilterDataType;
    active: boolean;
    dateOnly?: boolean;
    // rangeStart: any;
    // rangeEnd: any;
}

export type FilterData = Record<string, IFilterData>;

export interface IOrderData {
    field: string;
    order: 'ASC' | 'DESC';
}

export const isDateType = (type: any) =>
    ['date', 'datetime'].includes(type as string) || type instanceof Date;

export const isNumberType = (type: any) =>
    ['integer', 'number', 'numeric', 'decimal'].includes(type as string) ||
    type instanceof Number;

export const isStringType = (type: any) =>
    ['varchar'].includes(type as string) || type instanceof String;

export const isBooleanType = (type: any) => type === 'boolean';

export class AppBaseEntity extends BaseEntity implements IAppBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

    public static readonly FRIENDLY_NAME_SINGULAR: string = '';
    public static readonly FRIENDLY_NAME_PLURAL: string = '';
    public static readonly API_ENDPOINT_NAME: string = '';

    public static readonly FRIENDLY_COLUMN_NAMES: Record<string, string> = {
        createdAt: 'Criado em',
        updatedAt: 'Atualizado em',
    };

    static async createWithAttrs<T extends AppBaseEntity>(
        this: StaticThis<T>,
        attributes: Record<string, any>
    ) {
        const instance = new this();

        // using this since constructor does not work
        instance.setAttributes(attributes);

        return instance.save();
    }

    static requiredAttributes<T extends AppBaseEntity>(this: StaticThis<T>) {
        return this.getRepository<T>()
            .metadata.columns.filter((column) => !column.isNullable)
            .map((column) => column.propertyName);
    }

    static findPaginated<T extends AppBaseEntity>(
        this: StaticThis<T>,
        pageSize: number,
        pageNum = 1
    ) {
        return this.findAndCount<T>({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }

    static queryByFilterData<T extends AppBaseEntity>(
        this: StaticThis<T>,
        filterData: FilterData,
        pageSize: number,
        pageNum = 1,
        orderData?: IOrderData
    ) {
        const repository = this.getRepository<T>();
        const queryBuilder = this.createQueryBuilder<T>();

        const columnsMap = Object.fromEntries(
            repository.metadata.columns.map(
                ({ propertyName, type, databaseName }) => [
                    propertyName,
                    { type, databaseName },
                ]
            )
        );

        Object.entries(filterData).forEach(([field, data]) => {
            if (!data.active) return;

            const { type } = columnsMap[field];
            const isDate = isDateType(type);

            let value = isDate ? parseISO(data.value) : data.value;

            if (isDate && data.dateOnly)
                value = formatISO(value, { representation: 'date' });

            switch (data.type) {
                case 'equals_to':
                    queryBuilder.andWhere({ [field]: Equal(value) });
                    break;
                case 'greater_than':
                    queryBuilder.andWhere({ [field]: MoreThan(value) });
                    break;
                case 'greater_than_or_equal':
                    queryBuilder.andWhere({
                        [field]: MoreThanOrEqual(value),
                    });
                    break;
                case 'less_than':
                    queryBuilder.andWhere({ [field]: LessThan(value) });
                    break;
                case 'less_than_or_equal':
                    queryBuilder.andWhere({
                        [field]: LessThanOrEqual(value),
                    });
                    break;
                case 'includes':
                    queryBuilder.andWhere({ [field]: Like(`%${data.value}%`) });
                    break;
                case 'starts_with':
                    queryBuilder.andWhere({ [field]: Like(`${value}%`) });
                    break;
                case 'ends_with':
                    queryBuilder.andWhere({ [field]: Like(`%${value}`) });
                    break;
                default:
                    throw Error('Invalid filter data type');
            }
        });

        if (orderData) {
            queryBuilder.orderBy(
                columnsMap[orderData.field].databaseName,
                orderData.order
            );
        }

        queryBuilder.skip((pageNum - 1) * pageSize).take(pageSize);

        return queryBuilder.getManyAndCount();
    }

    setAttributes(attributes: Record<string, any>) {
        Object.assign(this, attributes);
    }

    async saveWithAttributes(attributes: Record<string, any>) {
        // If ID is different it will create a new record
        delete attributes.id;

        this.setAttributes(attributes);

        return this.save();
    }
}
