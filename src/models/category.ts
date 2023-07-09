import { Entity, Column } from 'typeorm';
import { ISyncableEntity, SyncableEntity } from './syncableEntity';

export interface ICategory extends ISyncableEntity {
    id: number;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt?: Date;
}

@Entity('CATEGORY')
export class Category extends SyncableEntity implements ICategory {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    color!: string;
}
