import { routes } from '@/router';
import { setActivePinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { TestingPinia, createTestingPinia } from '@pinia/testing';

import { DatabaseHelper } from '../../../../databaseHelper';
import { initialState as appInitialState } from '@/store/app';
import FreightAccountEdit from '@/views/Freights/Accounts/FreightAccountEdit.vue';
import {
    initialState as accountsInitialState,
    useAccountsStore,
} from '@/store/accounts';
import { Router, createRouter, createWebHistory } from 'vue-router';
import { Freight, FreightCargo, FreightStatus } from '@/models/freight';
import {
    initialState as freightsInitialState,
    useFreightsStore,
} from '@/store/freights';
import { Account } from '@/models/account';
import { Category } from '@/models/category';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/utils/date');

jest.mock('@/database/dataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

let router: Router;
let freight: Freight;
let account: Account;
let category: Category;
let testingPinia: TestingPinia;

beforeAll(async () => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('FreightAccountEdit.vue', () => {
    beforeEach(async () => {
        testingPinia = createTestingPinia({
            initialState: {
                application: appInitialState(),
                accounts: accountsInitialState(),
                freights: freightsInitialState(),
            },
        });

        setActivePinia(testingPinia);

        router = createRouter({
            history: createWebHistory(),
            routes: routes,
        });

        freight = await Freight.createWithAttrs({
            description: 'Frete 1',
            cargo: FreightCargo.GENERAL,
            status: FreightStatus.NOT_STARTED,
            cargoWeight: 1.75,
            contractor: 'Jefferson',
            agreedPayment: 950.33,
            startDate: '2023-06-05T02:53:26.213Z',
            distance: 1550.0,
            originCountry: 'Brasil',
            originCity: 'Brasília',
            originState: 'DF',
            destinationCountry: 'Brasil',
            destinationCity: 'São Paulo',
            destinationState: 'SP',
        });

        category = await Category.createWithAttrs({
            name: 'test',
            color: '#f455a4',
        });

        account = await Account.createWithAttrs({
            freightId: freight.id,
            categoryId: category.id,
            name: 'teste',
            value: -123.35,
            description: 'descricao',
            accountDate: new Date(),
        });

        router.push(`/freights/${freight.id}/accounts/${account.id}/edit`);
        await router.isReady();
    });

    it('renders freight account edit vue', async () => {
        const accountStore = useAccountsStore();
        const freightsStore = useFreightsStore();

        jest.spyOn(freightsStore, 'findFreight').mockResolvedValueOnce(freight);

        jest.spyOn(accountStore, 'findEditAccount').mockResolvedValueOnce(true);

        const wrapper = mount(FreightAccountEdit, {
            global: {
                plugins: [router, testingPinia],
            },
        });

        await flushPromises();

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Gastos Frete');
    });
});
