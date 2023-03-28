import accountsDataSource, {
    DataSourceType,
} from '@/database/data_sources/accountsDataSource';

import sqliteConnection, { SQLiteConnectionType } from '@/database';
import { Capacitor } from '@capacitor/core';

export type DatabaseInfo = {
    sqlite: SQLiteConnectionType;
    platform: string;
    connection: DataSourceType;
};

const getDatabaseInfo = (): DatabaseInfo => {
    const platform = Capacitor.getPlatform();

    return {
        sqlite: sqliteConnection,
        platform,
        connection: accountsDataSource,
    };
};

export const runDatabaseOperation = async (
    callback: (dbInfo: DatabaseInfo) => Promise<any>
) => {
    const dbInfo = getDatabaseInfo();

    const { sqlite, platform, connection } = dbInfo;

    await callback(dbInfo);

    if (platform === 'web' && process.env.JEST_WORKER_ID === undefined) {
        await sqlite.saveToStore(connection.options.database as string);
    }
};
