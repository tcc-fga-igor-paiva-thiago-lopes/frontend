import { Entity, Column, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { SyncableEntity, ISyncableEntity } from './syncableEntity';
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

export interface IProfitPerCargoResult extends Record<string, any> {
    num: number;
    total: number;
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
    })
    startDate!: Date;

    @Column({
        name: 'due_date',
        nullable: true,
    })
    dueDate?: Date;

    @Column({
        name: 'finished_date',
        nullable: true,
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
    public static readonly API_ENDPOINT_NAME: string = 'freights';

    public static readonly FRIENDLY_COLUMN_NAMES: Record<string, string> = {
        cargo: 'Tipo de carga',
        status: 'Status',
        description: 'Descrição',
        contractor: 'Contratante',
        cargoWeight: 'Peso carga',
        agreedPayment: 'Pagamento total',
        distance: 'Distância',
        startDate: 'Data de início',
        dueDate: 'Data limite',
        finishedDate: 'Data de conclusão',
        originCity: 'Cidade de origem',
        originState: 'Estado de origem',
        originCountry: 'País de origem',
        originLatitude: 'Latitude de origem',
        originLongitude: 'Longitude de origem',
        destinationCity: 'Cidade de destino',
        destinationState: 'Estado de destino',
        destinationCountry: 'País de destino',
        destinationLatitude: 'Latitude de destino',
        destinationLongitude: 'Longitude de destino',
        ...SyncableEntity.FRIENDLY_COLUMN_NAMES,
    };

    static profitPerColumn(
        column: string,
        startDate?: string,
        endDate?: string
    ) {
        // TODO: consider spents
        const queryBuilder = Freight.createQueryBuilder()
            .select(column)
            .addSelect('COUNT(FREIGHT.id)', 'num')
            .addSelect('SUM(FREIGHT.agreed_payment)', 'total')
            .where({ status: FreightStatus.FINISHED })
            .groupBy(column)
            .orderBy('total', 'DESC');

        if (startDate) {
            queryBuilder.andWhere({
                finishedDate: MoreThanOrEqual(new Date(startDate)),
            });
        }

        if (endDate) {
            queryBuilder.andWhere({
                finishedDate: LessThanOrEqual(new Date(endDate)),
            });
        }

        return queryBuilder.getRawMany<IProfitPerCargoResult>();
    }
}
