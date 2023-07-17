import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeUpdate,
    BeforeInsert,
} from 'typeorm';
import { ISyncableEntity, SyncableEntity } from './syncableEntity';
import { Freight } from './freight';
import { Category } from './category';

export interface IAccount extends ISyncableEntity {
    id: number;
    name: string;
    value: number;
    description: string;
    accountDate: Date;
    freightId: number;
    categoryId: number;
    createdAt: Date;
    updatedAt?: Date;
}

@Entity('ACCOUNT')
export class Account extends SyncableEntity implements IAccount {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ nullable: false, type: 'decimal' })
    value!: number;

    @Column({
        name: 'account_date',
        nullable: false,
    })
    accountDate!: Date;

    @Column({
        name: 'freight_id',
        nullable: false,
    })
    freightId!: number;

    @Column({
        name: 'category_id',
        nullable: false,
    })
    categoryId!: number;

    @ManyToOne(() => Freight, (freight) => freight.accounts, {
        lazy: true,
        cascade: true,
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn({ name: 'freight_id', referencedColumnName: 'id' })
    freight!: Promise<Freight>;

    @ManyToOne(() => Category, undefined, {
        eager: true,
        cascade: true,
        nullable: false,
        onDelete: 'RESTRICT',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category!: Category;

    @BeforeInsert()
    @BeforeUpdate()
    updateSyncedOnUpdate() {
        this.synced = false;
        this.value = -1 * Math.abs(this.value);
    }

    public static readonly FRIENDLY_NAME_SINGULAR: string = 'Conta';
    public static readonly FRIENDLY_NAME_PLURAL: string = 'Contas';
    public static readonly API_ENDPOINT_NAME: string = 'accounts';

    public static readonly FRIENDLY_COLUMN_NAMES: Record<string, string> = {
        name: 'Nome',
        value: 'Valor',
        accountDate: 'Data',
        description: 'Descrição',
        ...SyncableEntity.FRIENDLY_COLUMN_NAMES,
    };
}
