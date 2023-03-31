import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';

import { TestHelper } from '../testHelper';

import { Account } from '@/models/account';
import { useAccountsStore } from '@/store/accounts';

beforeAll(() => TestHelper.instance.setupTestDB());

afterAll(() => TestHelper.instance.teardownTestDB());

describe('HomePage.vue', () => {
    beforeEach(() => {
        // creates a fresh pinia and make it active so it's automatically picked
        // up by any useStore() call without having to pass it to it:
        // `useStore(pinia)`
        setActivePinia(createPinia());
    });

    it('renders home vue', () => {
        const wrapper = mount(HomePage);

        expect(wrapper.text()).toMatch('Bem-vindo!');
    });

    it('should create account', async () => {
        const account = await Account.createWithAttrs({ name: 'asda' });

        expect(account.id).toEqual(1);
        expect(account.name).toEqual('asda');
    });

    it('should find account', async () => {
        const { addAccount } = useAccountsStore();

        await addAccount({ name: 'Test one' });

        const account = await Account.findOneBy({ name: 'Test one' });

        expect(account?.id).toBeGreaterThanOrEqual(1);
        expect(account?.name).toEqual('Test one');
    });
});
