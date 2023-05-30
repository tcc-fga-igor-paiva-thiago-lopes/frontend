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
    dueDate?: Date;
    finishedDate?: Date;
    originCity: string;
    originState: string;
    originCountry?: string;
    originLatitude?: number;
    originLongitude?: number;
    destinationCity: string;
    destinationState: string;
    destinationCountry?: string;
    destinationLatitude?: number;
    destinationLongitude?: number;
    createdAt: Date;
    updatedAt?: Date;
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

    @Column({ name: 'due_date', nullable: true })
    dueDate!: Date;

    @Column({ name: 'finished_date', nullable: true })
    finishedDate!: Date;

    @Column({ name: 'origin_city', nullable: false })
    originCity!: string;

    @Column({ name: 'origin_state', nullable: false })
    originState!: string;

    @Column({ name: 'origin_country', nullable: true })
    originCountry!: string;

    @Column({ name: 'origin_latitude', nullable: true })
    originLatitude!: number;

    @Column({ name: 'origin_longitude', nullable: true })
    originLongitude!: number;

    @Column({ name: 'destination_city', nullable: false })
    destinationCity!: string;

    @Column({ name: 'destination_state', nullable: false })
    destinationState!: string;

    @Column({ name: 'destination_country', nullable: true })
    destinationCountry!: string;

    @Column({ name: 'destination_latitude', nullable: true })
    destinationLatitude!: number;

    @Column({ name: 'destination_longitude', nullable: true })
    destinationLongitude!: number;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return Freight.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
