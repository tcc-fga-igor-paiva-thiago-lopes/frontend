import { Entity, Column } from 'typeorm';
import { SyncableEntity, ISyncableEntity } from './syncableEntity';
import { datetimeTransformer } from './helpers/datetimeTransformer';

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

export enum FreightStatus {
    NOT_STARTED = 'Não iniciado',
    STARTED = 'Em progresso',
    WAITING_UNLOAD = 'Aguardando descarga',
    // WAITING_PAYMENT = 'Aguardando pagamento',
    FINISHED = 'Finalizado',
}

export interface IFreight extends ISyncableEntity {
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
export class Freight extends SyncableEntity implements IFreight {
    @Column({ nullable: false, enum: FreightCargo })
    cargo!: string;

    @Column({ nullable: false, enum: FreightStatus })
    status!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ nullable: false })
    contractor!: string;

    @Column({ name: 'cargo_weight', nullable: false, type: 'decimal' })
    cargoWeight!: number;

    @Column({ name: 'agreed_payment', nullable: false, type: 'decimal' })
    agreedPayment!: number;

    @Column({ nullable: false, type: 'decimal' })
    distance!: number;

    @Column({
        name: 'start_date',
        nullable: false,
        transformer: datetimeTransformer,
    })
    startDate!: Date;

    @Column({
        name: 'due_date',
        nullable: true,
        transformer: datetimeTransformer,
    })
    dueDate?: Date;

    @Column({
        name: 'finished_date',
        nullable: true,
        transformer: datetimeTransformer,
    })
    finishedDate?: Date;

    @Column({ name: 'origin_city', nullable: false })
    originCity!: string;

    @Column({ name: 'origin_state', nullable: false })
    originState!: string;

    @Column({ name: 'origin_country', nullable: true })
    originCountry?: string;

    @Column({ name: 'origin_latitude', nullable: true, type: 'decimal' })
    originLatitude?: number;

    @Column({ name: 'origin_longitude', nullable: true, type: 'decimal' })
    originLongitude?: number;

    @Column({ name: 'destination_city', nullable: false })
    destinationCity!: string;

    @Column({ name: 'destination_state', nullable: false })
    destinationState!: string;

    @Column({ name: 'destination_country', nullable: true })
    destinationCountry?: string;

    @Column({ name: 'destination_latitude', nullable: true, type: 'decimal' })
    destinationLatitude?: number;

    @Column({ name: 'destination_longitude', nullable: true, type: 'decimal' })
    destinationLongitude?: number;

    public static readonly FRIENDLY_NAME_SINGULAR: string = 'Frete';
    public static readonly FRIENDLY_NAME_PLURAL: string = 'Fretes';
}
