import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AppBaseEntity } from './appBaseEntity';

export interface IAccount extends Record<string, any> {
    id: number;
    name: string;
}

@Entity('accounts')
export class Account extends AppBaseEntity implements IAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
