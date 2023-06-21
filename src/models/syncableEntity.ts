import {
    In,
    Not,
    IsNull,
    Index,
    Column,
    Generated,
    DeleteDateColumn,
} from 'typeorm';
import { AppBaseEntity, IAppBaseEntity } from './appBaseEntity';

export type StaticThis<T> = { new (): T } & typeof AppBaseEntity;

export interface ISyncableEntity extends IAppBaseEntity {
    identifier: string;
    synced: boolean;
    deletedAt?: Date;
}

export abstract class SyncableEntity
    extends AppBaseEntity
    implements ISyncableEntity
{
    @Index()
    @Column({ nullable: true, type: 'uuid' })
    @Generated('uuid')
    identifier!: string;

    @Index()
    @Column({ nullable: false, default: false, type: 'boolean' })
    synced!: boolean;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    static async notSynced<T extends SyncableEntity>(
        this: StaticThis<T>,
        maxRecords = 100
    ) {
        const createdOrModified = await this.createQueryBuilder<T>()
            .where({ synced: false, deletedAt: IsNull() })
            .orderBy('updated_at', 'ASC', 'NULLS FIRST')
            .take(maxRecords)
            .getMany();

        const deleted = await this.createQueryBuilder<T>()
            .select('identifier')
            .where({ deletedAt: Not(IsNull()) })
            .orderBy('deleted_at', 'ASC')
            .take(maxRecords)
            .getMany();

        return [createdOrModified, deleted];
    }

    static async updateByIdentifiers<T extends SyncableEntity>(
        this: StaticThis<T>,
        identifiers: string[],
        attributes: Record<string, any>
    ) {
        return this.createQueryBuilder<T>()
            .update(this)
            .set(attributes)
            .where({ identifier: In(identifiers) })
            .execute();
    }

    static async deleteByIdentifiers<T extends SyncableEntity>(
        this: StaticThis<T>,
        identifiers: string[]
    ) {
        return this.createQueryBuilder<T>()
            .delete()
            .where({ identifier: In(identifiers) })
            .execute();
    }
}
