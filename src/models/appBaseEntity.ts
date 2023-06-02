import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

export type StaticThis<T> = { new (attrs?: Record<string, any>): T };

export interface IAppBaseEntity extends Record<string, any> {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
}

export abstract class AppBaseEntity
    extends BaseEntity
    implements IAppBaseEntity
{
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

    // this is not working
    // constructor(attributes?: Record<string, any>) {
    //   // console.log(attributes);

    //   super();

    //   if (attributes) this.setAttributes(attributes);
    // }

    static async createWithAttrs<T extends AppBaseEntity>(
        this: StaticThis<T>,
        attributes: Record<string, any>
    ) {
        const instance = new this(attributes);

        // using this since constructor does not work
        instance.setAttributes(attributes);

        return instance.save();
    }

    setAttributes(attributes: Record<string, any>) {
        Object.assign(this, attributes);
    }

    async saveWithAttributes(attributes: Record<string, any>) {
        Object.assign(this, attributes);

        return this.save();
    }
}
