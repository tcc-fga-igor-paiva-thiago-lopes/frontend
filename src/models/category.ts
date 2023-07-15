import { Entity, Column, Index } from 'typeorm';
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
    @Index({ unique: true })
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    color!: string;

    public static readonly FRIENDLY_NAME_SINGULAR: string = 'Categoria';
    public static readonly FRIENDLY_NAME_PLURAL: string = 'Categorias';
    public static readonly API_ENDPOINT_NAME: string = 'categories';

    public static readonly FRIENDLY_COLUMN_NAMES: Record<string, string> = {
        name: 'Nome',
        color: 'Cor',
        ...SyncableEntity.FRIENDLY_COLUMN_NAMES,
    };
}
