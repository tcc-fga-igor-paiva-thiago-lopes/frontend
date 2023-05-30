import { Table, QueryRunner, MigrationInterface } from 'typeorm';

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
                        length: '50',
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
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('FREIGHT');
    }
}
