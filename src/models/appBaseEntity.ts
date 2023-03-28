import { BaseEntity } from 'typeorm';

export type StaticThis<T> = { new (attrs?: Record<string, any>): T };

export abstract class AppBaseEntity extends BaseEntity {
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
