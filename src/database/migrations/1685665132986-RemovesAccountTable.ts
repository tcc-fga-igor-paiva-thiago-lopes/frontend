import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovesAccountTable1685665132986 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('accounts');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "accounts" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL
            );
        `);
    }
}
