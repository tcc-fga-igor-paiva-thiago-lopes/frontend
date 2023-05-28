import { DataSource } from 'typeorm';

import sqliteConnection from '@/database';
import { Account } from '@/models/account';
import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'truckDriverAppConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: process.env.VUE_APP_DB_NAME || 'truck-driver-app',
    entities: [Account],
    migrations: [AddAccountsTable1679179393713],
    // entities: ['src/models/**/*.ts', '!src/models/appBaseEntity.ts'],
    // migrations: ['src/database/migrations/**/*.ts'],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
