import {
    In,
    IsNull,
    Index,
    Column,
    Generated,
    BeforeUpdate,
    BeforeRecover,
    DeleteDateColumn,
} from 'typeorm';
import { AppBaseEntity, IAppBaseEntity } from './appBaseEntity';

export type StaticThis<T> = { new (): T } & typeof AppBaseEntity;

export interface ISyncableEntity extends IAppBaseEntity {
    identifier: string;
    synced: boolean;
    deletedAt?: Date;
}

export class SyncableEntity extends AppBaseEntity implements ISyncableEntity {
    @Index()
    @Column({ nullable: true, type: 'uuid' })
    @Generated('uuid')
    identifier!: string;

    @Index()
    @Column({ nullable: false, default: false, type: 'boolean' })
    synced!: boolean;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @BeforeUpdate()
    updateSyncedOnUpdate() {
        this.synced = false;
    }

    @BeforeRecover()
    updateSyncedAfterRecovery() {
        this.synced = false;
    }

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
            .andWhere('deleted_at IS NOT NULL')
            .orderBy('deleted_at', 'ASC')
            .take(maxRecords)
            .withDeleted()
            .getRawMany();

        const deletedIdentifiers = deleted.map((item) => item.identifier);

        return [createdOrModified, deletedIdentifiers] as [T[], string[]];
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
