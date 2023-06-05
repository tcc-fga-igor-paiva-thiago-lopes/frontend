import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { TestingPinia, createTestingPinia } from '@pinia/testing';

const mockApiAdapter = jest.fn();

import { DatabaseHelper } from '../../../databaseHelper';
import { initialState as appInitialState } from '@/store/app';
import FreightCreate from '@/views/Freights/FreightCreate.vue';
import { initialState as freightsInitialState } from '@/store/freights';

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

let testingPinia: TestingPinia;

beforeAll(async () => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB);

describe('FreightCreate.vue', () => {
    beforeEach(() => {
        testingPinia = createTestingPinia({
            initialState: {
                application: appInitialState(),
                freights: freightsInitialState(),
            },
        });

        setActivePinia(testingPinia);
    });

    it('renders freight create vue', async () => {
        const wrapper = mount(FreightCreate, {
            global: {
                plugins: [testingPinia],
            },
        });

        const form = wrapper.find('ion-content>form');
        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Fretes');

        expect(form.exists()).toBe(true);
    });
});
