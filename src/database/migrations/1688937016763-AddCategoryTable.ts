import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddCategoryTable1688937016763 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'CATEGORY',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'color',
                        type: 'varchar',
                        isNullable: false,
                        length: '7',
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: true,
                    },
                    {
                        name: 'synced',
                        type: 'boolean',
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'identifier',
                        isNullable: true,
                        type: 'varchar',
                        length: '36',
                    },
                ],
            }),
            true
        );

        await queryRunner.createIndex(
            'CATEGORY',
            new TableIndex({
                name: 'IDX_CATEGORY_synced',
                columnNames: ['synced'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('CATEGORY');
    }
}
