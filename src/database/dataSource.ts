import { DataSource } from 'typeorm';

import sqliteConnection from '@/database';
import { Freight } from '@/models/freight';

import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';
import { AddsFreightTable1685069028734 } from '@/database/migrations/1685069028734-AddsFreightTable';
import { RemovesAccountTable1685665132986 } from './migrations/1685665132986-RemovesAccountTable';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'truckDriverAppConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: process.env.VUE_APP_DB_NAME || 'truck-driver-app',
    entities: [Freight],
    migrations: [
        AddAccountsTable1679179393713,
        AddsFreightTable1685069028734,
        RemovesAccountTable1685665132986,
    ],
    // entities: ['src/models/**/*.ts', '!src/models/appBaseEntity.ts'],
    // migrations: ['src/database/migrations/**/*.ts'],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
