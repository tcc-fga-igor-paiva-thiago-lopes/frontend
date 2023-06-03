import { Entity, Column } from 'typeorm';
import { AppBaseEntity, IAppBaseEntity } from './appBaseEntity';

export enum FreightCargo {
    GENERAL = 'Geral',
    CONTAINERIZED = 'Conteinerizada',
    REFRIGERATED = 'Frigorificada',
    LIQUID_BULK = 'Granel Líquido',
    PRESSURIZED_BULK = 'Granel Pressurizada',
    SOLID_BULK = 'Granel Sólido',
    NEW_BULK = 'Neogranel',
    DANGEROUS_GENERAL = 'Perigosa Geral',
    DANGEROUS_CONTAINERIZED = 'Perigosa Conteinerizada',
    DANGEROUS_REFRIGERATED = 'Perigosa Frigorificada',
    DANGEROUS_LIQUID_BULK = 'Perigosa Granel Líquido',
    DANGEROUS_PRESSURIZED_BULK = 'Perigosa Granel Pressurizada',
    DANGEROUS_SOLID_BULK = 'Perigosa Granel Sólido',
}

export interface IFreight extends IAppBaseEntity {
    id: number;
    cargo: string;
    description: string;
    contractor: string;
    cargoWeight: number;
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
    @Column({ nullable: false, enum: FreightCargo })
    cargo!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ nullable: false })
    contractor!: string;

    @Column({ name: 'cargo_weight', nullable: false })
    cargoWeight!: number;

    @Column({ name: 'agreed_payment', nullable: false })
    agreedPayment!: number;

    @Column({ nullable: false })
    distance!: number;

    @Column({ name: 'start_date', nullable: false })
    startDate!: Date;

    @Column({ name: 'due_date', nullable: true })
    dueDate?: Date;

    @Column({ name: 'finished_date', nullable: true })
    finishedDate?: Date;

    @Column({ name: 'origin_city', nullable: false })
    originCity!: string;

    @Column({ name: 'origin_state', nullable: false })
    originState!: string;

    @Column({ name: 'origin_country', nullable: true })
    originCountry?: string;

    @Column({ name: 'origin_latitude', nullable: true })
    originLatitude?: number;

    @Column({ name: 'origin_longitude', nullable: true })
    originLongitude?: number;

    @Column({ name: 'destination_city', nullable: false })
    destinationCity!: string;

    @Column({ name: 'destination_state', nullable: false })
    destinationState!: string;

    @Column({ name: 'destination_country', nullable: true })
    destinationCountry?: string;

    @Column({ name: 'destination_latitude', nullable: true })
    destinationLatitude?: number;

    @Column({ name: 'destination_longitude', nullable: true })
    destinationLongitude?: number;

    static async findPaginated(pageSize: number, pageNum = 1) {
        return Freight.findAndCount({
            take: pageSize,
            skip: (pageNum - 1) * pageSize,
        });
    }
}
