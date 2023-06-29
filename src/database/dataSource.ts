import { DataSource } from 'typeorm';

import sqliteConnection from '@/database';
import { Category } from '@/models/category';

import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';
import { AddCategoriesTable1685921479153 } from '@/database/migrations/1685921479153-AddCategoriesTable';
import { DropAccountsTable1686060227122 } from '@/database/migrations/1686060227122-DropAccountsTable';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'truckDriverAppConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: process.env.VUE_APP_DB_NAME || 'truck-driver-app',
    entities: [Category],
    migrations: [
        AddAccountsTable1679179393713,
        AddCategoriesTable1685921479153,
        DropAccountsTable1686060227122,
    ],
    // entities: ['src/models/**/*.ts', '!src/models/appBaseEntity.ts'],
    // migrations: ['src/database/migrations/**/*.ts'],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
