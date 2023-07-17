import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddsUniqueIndexToCategoryName1689446434894
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'CATEGORY',
            new TableIndex({
                name: 'IDX_CATEGORY_name',
                columnNames: ['name'],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('CATEGORY', 'IDX_CATEGORY_name');
    }
}
