import { Router } from 'vue-router';
import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { TestingPinia, createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from '@ionic/vue-router';

const mockApiAdapter = jest.fn();

import { routes } from '@/router';
import { DatabaseHelper } from '../../../databaseHelper';
import FreightShow from '@/views/Freights/FreightShow.vue';
import { initialState as appInitialState } from '@/store/app';
import {
    initialState as freightsInitialState,
    useFreightsStore,
} from '@/store/freights';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/dataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/services/api', () => {
    return jest.fn().mockImplementation(() => {
        return { APIAdapter: mockApiAdapter };
    });
});

let router: Router;
let testingPinia: TestingPinia;

beforeAll(async () => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB);

describe('FreightShow.vue', () => {
    beforeEach(async () => {
        testingPinia = createTestingPinia({
            initialState: {
                application: appInitialState(),
                freights: freightsInitialState(),
            },
        });

        setActivePinia(testingPinia);

        router = createRouter({
            history: createWebHistory(),
            routes: routes,
        });

        router.push('/freights/1');
        await router.isReady();
    });

    it('renders freight show vue', async () => {
        const freightsStore = useFreightsStore();

        jest.spyOn(freightsStore, 'findFreight').mockResolvedValue({});

        const wrapper = mount(FreightShow, {
            global: {
                plugins: [router, testingPinia],
            },
        });

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Fretes');

        expect(freightsStore.findFreight).toHaveBeenCalledWith(1, true);
    });
});
