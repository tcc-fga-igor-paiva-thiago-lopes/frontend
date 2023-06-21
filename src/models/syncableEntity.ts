import { Index, Column, Generated, DeleteDateColumn } from 'typeorm';
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
}
