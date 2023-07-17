import {
    MigrationInterface,
    QueryRunner,
    TableIndex,
    TableUnique,
} from 'typeorm';

export class RemovesAccountNameIndex1689528433474
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('ACCOUNT', 'IDX_ACCOUNT_name');

        await queryRunner.createUniqueConstraint(
            'ACCOUNT',
            new TableUnique({
                name: 'IDX_ACCOUNT_name_freight_id',
                columnNames: ['name', 'freight_id'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'ACCOUNT',
            new TableIndex({
                name: 'IDX_ACCOUNT_name',
                columnNames: ['name'],
                isUnique: true,
            })
        );

        await queryRunner.dropUniqueConstraint(
            'ACCOUNT',
            'IDX_ACCOUNT_name_freight_id'
        );
    }
}
