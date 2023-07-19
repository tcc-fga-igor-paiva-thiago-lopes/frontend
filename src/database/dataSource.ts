import { DataSource } from 'typeorm';

import sqliteConnection from '@/database';
import { Freight } from '@/models/freight';
import { Account } from '@/models/account';
import { Category } from '@/models/category';

import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';
import { AddsFreightTable1685069028734 } from '@/database/migrations/1685069028734-AddsFreightTable';
import { RemovesAccountTable1685665132986 } from './migrations/1685665132986-RemovesAccountTable';
import { AddSyncRelatedColumnsToFreights1686187611180 } from './migrations/1686187611180-AddSyncRelatedColumnsToFreights';
import { AddCategoryTable1688937016763 } from './migrations/1688937016763-AddCategoryTable';
import { AddsAccountTable1689247621818 } from './migrations/1689247621818-AddsAccountTable';
import { AddsUniqueIndexToCategoryName1689446434894 } from './migrations/1689446434894-AddsUniqueIndexToCategoryName';
import { RemovesAccountNameIndex1689528433474 } from './migrations/1689528433474-RemovesAccountNameIndex';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'truckDriverAppConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: process.env.VUE_APP_DB_NAME || 'truck-driver-app',
    entities: [Freight, Category, Account],
    migrations: [
        AddAccountsTable1679179393713,
        AddsFreightTable1685069028734,
        RemovesAccountTable1685665132986,
        AddSyncRelatedColumnsToFreights1686187611180,
        AddCategoryTable1688937016763,
        AddsAccountTable1689247621818,
        AddsUniqueIndexToCategoryName1689446434894,
        RemovesAccountNameIndex1689528433474,
    ],
    // entities: ['src/models/**/*.ts', '!src/models/appBaseEntity.ts'],
    // migrations: ['src/database/migrations/**/*.ts'],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
