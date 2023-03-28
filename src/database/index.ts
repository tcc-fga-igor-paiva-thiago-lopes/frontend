import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

export type SQLiteConnectionType = SQLiteConnection;

const connection = new SQLiteConnection(CapacitorSQLite);

export default connection;
