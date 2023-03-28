import { DataSource } from 'typeorm';

import { Account } from '@/models/account';
import sqliteConnection from '@/database';
import { AddAccountsTable1679179393713 } from '@/database/migrations/1679179393713-AddAccountsTable';

export type DataSourceType = DataSource;

export default new DataSource({
    name: 'accountConnection',
    type: 'capacitor',
    driver: sqliteConnection,
    database: 'ionic-vue-user',
    entities: [Account],
    migrations: [AddAccountsTable1679179393713],
    logging: ['error', 'query', 'schema'],
    synchronize: false,
    migrationsRun: false,
});
