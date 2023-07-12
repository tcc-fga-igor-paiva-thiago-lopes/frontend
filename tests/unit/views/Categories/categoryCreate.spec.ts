import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { TestingPinia, createTestingPinia } from '@pinia/testing';

const mockApiAdapter = jest.fn();

import { DatabaseHelper } from '../../../databaseHelper';
import { initialState as appInitialState } from '@/store/app';
import CategoryCreate from '@/views/Categories/CategoryCreate.vue';
import { initialState as categoriesInitialState } from '@/store/categories';

jest.mock('@ckpack/vue-color', () => ({
    Compact: jest.fn(),
}));

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

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('CategoryCreate.vue', () => {
    beforeEach(() => {
        testingPinia = createTestingPinia({
            initialState: {
                application: appInitialState(),
                categories: categoriesInitialState(),
            },
        });

        setActivePinia(testingPinia);
    });

    it('renders category create vue', async () => {
        const wrapper = mount(CategoryCreate, {
            global: {
                plugins: [testingPinia],
            },
        });

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Categorias');
    });
});
