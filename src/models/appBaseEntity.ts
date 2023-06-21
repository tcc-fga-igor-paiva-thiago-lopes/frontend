import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

export type StaticThis<T> = { new (): T } & typeof BaseEntity;

export interface IAppBaseEntity extends Record<string, any> {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
}

export class AppBaseEntity extends BaseEntity implements IAppBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

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
