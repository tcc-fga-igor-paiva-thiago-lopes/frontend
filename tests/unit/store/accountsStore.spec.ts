import { setActivePinia, createPinia } from 'pinia';

import { Account } from '@/models/account';
import { useAccountsStore } from '@/store/accounts';
import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/accountsDataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

beforeAll(async () => DatabaseHelper.instance.setupTestDB(mockDataSource));

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('accountsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should create account', async () => {
        const { addAccount } = useAccountsStore();

        await addAccount({ name: 'Test one' });

        const account = await Account.findOneBy({ name: 'Test one' });

        expect(account?.id).toBeGreaterThanOrEqual(1);
        expect(account?.name).toEqual('Test one');
    });

    it('should find account using id', async () => {
        const { findAccount } = useAccountsStore();

        const account = await Account.createWithAttrs({ name: 'Search' });

        const foundAccount = await findAccount(account.id);

        expect(foundAccount).toBeTruthy();
        expect(foundAccount?.id).toBeGreaterThanOrEqual(1);
        expect(foundAccount?.name).toEqual('Search');
    });

    it('should load all accounts from database', async () => {
        const accountsStore = useAccountsStore();
        const { loadAccountsFromDatabase } = accountsStore;

        await Account.createWithAttrs({ name: 'One' });
        await Account.createWithAttrs({ name: 'Two' });

        await loadAccountsFromDatabase();

        expect(accountsStore.accounts).toEqual(await Account.find());
    });

    it('should remove account', async () => {
        const accountsStore = useAccountsStore();
        const { removeAccount } = accountsStore;

        const account = await Account.createWithAttrs({
            name: 'To remove',
        });

        await removeAccount(account.id);

        expect(await Account.findOneBy({ id: account.id })).toBeNull();
        expect(await Account.find()).toEqual(
            expect.not.arrayContaining([account])
        );
    });

    it('should update account', async () => {
        const accountsStore = useAccountsStore();
        const { updateAccount } = accountsStore;

        const account = await Account.createWithAttrs({
            name: 'To update',
        });

        await updateAccount(account.id, { name: 'Updated' });

        await account.reload();

        expect(account.name).toEqual('Updated');
        expect(accountsStore.accounts).toEqual(
            expect.arrayContaining([account])
        );
    });

    it('should remove all accounts', async () => {
        const accountsStore = useAccountsStore();
        const { removeAllAccounts } = accountsStore;

        await Account.createWithAttrs({ name: 'To be removed' });

        await removeAllAccounts();

        expect(await Account.find()).toEqual([]);
        expect(accountsStore.accounts).toEqual([]);
    });
});
