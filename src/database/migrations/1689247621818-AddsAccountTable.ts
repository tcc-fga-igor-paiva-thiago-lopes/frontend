import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';

export class AddsAccountTable1689247621818 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'ACCOUNT',
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
                        name: 'value',
                        type: 'numeric',
                        isNullable: false,
                    },
                    {
                        name: 'account_date',
                        type: 'datetime',
                        isNullable: false,
                    },
                    {
                        name: 'freight_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'category_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'identifier',
                        isNullable: false,
                        type: 'varchar',
                        length: '36',
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

        await queryRunner.createForeignKey(
            'ACCOUNT',
            new TableForeignKey({
                name: 'ACCOUNT_FREIGHT_FK',
                columnNames: ['freight_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'FREIGHT',
                onDelete: 'CASCADE',
                onUpdate: 'NO ACTION',
            })
        );

        await queryRunner.createForeignKey(
            'ACCOUNT',
            new TableForeignKey({
                name: 'ACCOUNT_CATEGORY_FK',
                columnNames: ['category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'CATEGORY',
                onDelete: 'RESTRICT',
                onUpdate: 'NO ACTION',
            })
        );

        await queryRunner.createIndices('ACCOUNT', [
            new TableIndex({
                name: 'IDX_ACCOUNT_freight_id',
                columnNames: ['freight_id'],
            }),
            new TableIndex({
                name: 'IDX_ACCOUNT_category_id',
                columnNames: ['category_id'],
            }),
            new TableIndex({
                name: 'IDX_ACCOUNT_name',
                columnNames: ['name'],
                isUnique: true,
            }),
            new TableIndex({
                name: 'IDX_ACCOUNT_synced',
                columnNames: ['synced'],
            }),
            new TableIndex({
                name: 'IDX_ACCOUNT_identifier',
                columnNames: ['identifier'],
                isUnique: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const accountTable = await queryRunner.getTable('ACCOUNT');

        if (!accountTable) return;

        await queryRunner.dropForeignKeys(
            accountTable,
            accountTable.foreignKeys
        );

        await queryRunner.dropIndices(accountTable, accountTable.indices);

        await queryRunner.dropTable(accountTable);
    }
}
