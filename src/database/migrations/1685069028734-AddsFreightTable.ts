import { Table, QueryRunner, MigrationInterface } from 'typeorm';

const cargoEnumValues = [
    'Geral',
    'Conteinerizada',
    'Frigorificada',
    'Granel Líquido',
    'Granel Pressurizada',
    'Granel Sólido',
    'Neogranel',
    'Frigorificada',
    'Perigosa Geral',
    'Perigosa Conteinerizada',
    'Perigosa Frigorificada',
    'Perigosa Granel Líquido',
    'Perigosa Granel Pressurizada',
    'Perigosa Granel Sólido',
];

const statusEnumValues = [
    'Não iniciado',
    'Em progresso',
    'Aguardando descarga',
    // 'Aguardando pagamento',
    'Finalizado',
];

export class AddsFreightTable1685069028734 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'FREIGHT',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'cargo',
                        type: 'varchar',
                        length: '30',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '30',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'contractor',
                        type: 'varchar',
                        length: '60',
                        isNullable: false,
                    },
                    {
                        name: 'cargo_weight',
                        type: 'numeric',
                        isNullable: false,
                    },
                    {
                        name: 'agreed_payment',
                        type: 'numeric',
                        isNullable: false,
                    },
                    {
                        name: 'distance',
                        type: 'numeric',
                        isNullable: false,
                    },
                    {
                        name: 'start_date',
                        type: 'datetime',
                        isNullable: false,
                    },
                    {
                        name: 'due_date',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'finished_date',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'origin_city',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'origin_state',
                        type: 'character',
                        length: '2',
                        isNullable: false,
                    },
                    {
                        name: 'origin_country',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'origin_latitude',
                        type: 'numeric',
                        isNullable: true,
                    },
                    {
                        name: 'origin_longitude',
                        type: 'numeric',
                        isNullable: true,
                    },
                    {
                        name: 'destination_city',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'destination_state',
                        type: 'character',
                        length: '2',
                        isNullable: false,
                    },
                    {
                        name: 'destination_country',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'destination_latitude',
                        type: 'numeric',
                        isNullable: true,
                    },
                    {
                        name: 'destination_longitude',
                        type: 'numeric',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                ],
                checks: [
                    {
                        name: 'CHK_CARGO_ENUM_VALUES',
                        columnNames: ['cargo'],
                        expression: `cargo IN(${cargoEnumValues
                            .map((item) => `'${item}'`)
                            .join(',')})`,
                    },
                    {
                        name: 'CHK_STATUS_ENUM_VALUES',
                        columnNames: ['status'],
                        expression: `status IN(${statusEnumValues
                            .map((item) => `'${item}'`)
                            .join(',')})`,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('FREIGHT');
    }
}
