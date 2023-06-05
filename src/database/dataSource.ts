import { DataSource } from 'typeorm';

import sqliteConnection from '@/database';
import { CategoryGroup } from '@/models/categoryGroup';

import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';
import { AddCategoriesGroupsTable1685921479153 } from '@/database/migrations/1685921479153-AddCategoriesGroupsTable';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'truckDriverAppConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: process.env.VUE_APP_DB_NAME || 'truck-driver-app',
    entities: [CategoryGroup],
    migrations: [
        AddAccountsTable1679179393713,
        AddCategoriesGroupsTable1685921479153,
    ],
    // entities: ['src/models/**/*.ts', '!src/models/appBaseEntity.ts'],
    // migrations: ['src/database/migrations/**/*.ts'],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
