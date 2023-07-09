import {
    TableColumn,
    MigrationInterface,
    QueryRunner,
    TableIndex,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddSyncRelatedColumnsToFreights1686187611180
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'FREIGHT',
            new TableColumn({
                name: 'synced',
                type: 'boolean',
                default: false,
                isNullable: false,
            })
        );

        await queryRunner.addColumn(
            'FREIGHT',
            new TableColumn({
                name: 'deleted_at',
                type: 'datetime',
                isNullable: true,
            })
        );

        await queryRunner.createIndex(
            'FREIGHT',
            new TableIndex({
                name: 'IDX_FREIGHT_synced',
                columnNames: ['synced'],
            })
        );

        // Add identifier column with null true
        await queryRunner.addColumn(
            'FREIGHT',
            new TableColumn({
                name: 'identifier',
                isNullable: true,
                type: 'varchar',
                length: '36',
            })
        );

        // Update the existing rows with UUID values
        const records = await queryRunner.query('SELECT id FROM FREIGHT');

        const updatePromises = records.map(async (row: any) => {
            return queryRunner.query(
                `UPDATE FREIGHT SET identifier = '${uuidv4()}' WHERE id = ${
                    row.id
                }`
            );
        });

        await Promise.all(updatePromises);

        // Change column to null false
        await queryRunner.changeColumn(
            'FREIGHT',
            'identifier',
            new TableColumn({
                name: 'identifier',
                isNullable: false,
                type: 'varchar',
                length: '36',
                isGenerated: true,
                isUnique: true,
                generationStrategy: 'uuid',
            })
        );

        await queryRunner.createIndex(
            'FREIGHT',
            new TableIndex({
                name: 'IDX_FREIGHT_identifier',
                columnNames: ['identifier'],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('FREIGHT', [
            'synced',
            'identifier',
            'deleted_at',
        ]);

        await queryRunner.dropIndex('FREIGHT', 'IDX_FREIGHT_identifier');

        await queryRunner.dropIndex('FREIGHT', 'IDX_FREIGHT_synced');
    }
}
