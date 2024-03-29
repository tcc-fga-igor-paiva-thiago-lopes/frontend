import { DataSource } from 'typeorm';
import Database, { Database as DatabaseType } from 'better-sqlite3';

export class DatabaseHelper {
    private static _instance: DatabaseHelper;

    public static get instance(): DatabaseHelper {
        if (!this._instance) this._instance = new DatabaseHelper();

        return this._instance;
    }

    public static dataSource() {
        return new DataSource({
            name: 'default',
            type: 'better-sqlite3',
            database: ':memory:',
            entities: ['src/models/**/*.ts'],
            synchronize: true,
        });
    }

    private dbConnect!: DataSource;
    private testdb!: DatabaseType;

    async setupTestDB(dataSource: DataSource) {
        this.testdb = new Database(':memory:', { verbose: console.log });

        this.dbConnect = dataSource;

        await this.dbConnect.initialize();

        await this.dbConnect.synchronize(true);
    }

    async teardownTestDB() {
        // this.dbConnect.close();
        await this.dbConnect.destroy();

        this.testdb.close();
    }
}
