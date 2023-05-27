import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AppBaseEntity } from './appBaseEntity';

export interface IFreight extends Record<string, any> {
    id: number;
    cargo: string;
    description: string;
    contractor: string;
    cargoWeight: string;
    agreedPayment: number;
    distance: number;
    startDate: Date;
    dueDate?: Date | null;
    finishedDate?: Date | null;
    originCity?: string | null;
    originState?: string | null;
    originCountry?: string | null;
    originLatitude?: number | null;
    originLongitude?: number | null;
    destinationCity?: string | null;
    destinationState?: string | null;
    destinationCountry?: string | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
    createdAt: Date;
    updatedAt?: Date | null;
}

@Entity('FREIGHT')
export class Freight extends AppBaseEntity implements IFreight {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    cargo!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ nullable: false })
    contractor!: string;

    @Column({ name: 'cargo_weight', nullable: false })
    cargoWeight!: string;

    @Column({ name: 'agreed_payment', nullable: false })
    agreedPayment!: number;

    @Column({ nullable: false })
    distance!: number;

    @Column({ name: 'start_date', nullable: false })
    startDate!: Date;

    @Column({ name: 'due_date' })
    dueDate!: Date;

    @Column({ name: 'finished_date' })
    finishedDate!: Date;

    @Column({ name: 'origin_city' })
    originCity!: string;

    @Column({ name: 'origin_state' })
    originState!: string;

    @Column({ name: 'origin_country' })
    originCountry!: string;

    @Column({ name: 'origin_latitude' })
    originLatitude!: number;

    @Column({ name: 'origin_longitude' })
    originLongitude!: number;

    @Column({ name: 'destination_city' })
    destinationCity!: string;

    @Column({ name: 'destination_state' })
    destinationState!: string;

    @Column({ name: 'destination_country' })
    destinationCountry!: string;

    @Column({ name: 'destination_latitude' })
    destinationLatitude!: number;

    @Column({ name: 'destination_longitude' })
    destinationLongitude!: number;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return Freight.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
