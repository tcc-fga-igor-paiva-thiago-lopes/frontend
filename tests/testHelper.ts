import { DataSource } from 'typeorm';
import { DOMWrapper } from '@vue/test-utils';
import Database, { Database as DatabaseType } from 'better-sqlite3';

export const getCSSProperty = (elWrapper: DOMWrapper<Element>, prop: string) =>
    getComputedStyle(elWrapper.element).getPropertyValue(prop);

export const environmentVariablesWrapper = async (
    variables: Record<string, any>,
    callback: () => any
) => {
    const prevEnv = { ...process.env };

    process.env = { ...process.env, ...variables };

    await callback();

    process.env = prevEnv;
};

export class TestHelper {
    private static _instance: TestHelper;

    public static get instance(): TestHelper {
        if (!this._instance) this._instance = new TestHelper();

        return this._instance;
    }

    private dbConnect!: DataSource;
    private testdb!: DatabaseType;

    async setupTestDB() {
        this.testdb = new Database(':memory:', { verbose: console.log });

        this.dbConnect = new DataSource({
            name: 'default',
            type: 'better-sqlite3',
            database: ':memory:',
            entities: ['src/models/**/*.ts'],
            synchronize: true,
        });

        await this.dbConnect.initialize();

        await this.dbConnect.synchronize(true);
    }

    async teardownTestDB() {
        // this.dbConnect.close();
        await this.dbConnect.destroy();

        this.testdb.close();
    }
}
