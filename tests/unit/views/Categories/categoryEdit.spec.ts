import { Router } from 'vue-router';
import { setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { TestingPinia, createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from '@ionic/vue-router';

const mockApiAdapter = jest.fn();

import { routes } from '@/router';
import { DatabaseHelper } from '../../../databaseHelper';
import CategoryEdit from '@/views/Categories/CategoryEdit.vue';
import { initialState as appInitialState } from '@/store/app';
import {
    initialState as categoriesInitialState,
    useCategoriesStore,
} from '@/store/categories';

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

let router: Router;
let testingPinia: TestingPinia;

beforeAll(async () => {
    process.env.VUE_APP_API_TIMEOUT = '5000';
    process.env.VUE_APP_API_URL = 'http://localhost:5000';

    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('CategoryEdit.vue', () => {
    beforeEach(async () => {
        testingPinia = createTestingPinia({
            initialState: {
                application: appInitialState(),
                categories: categoriesInitialState(),
            },
        });

        setActivePinia(testingPinia);

        router = createRouter({
            history: createWebHistory(),
            routes: routes,
        });

        router.push('/categories/1/edit');
        await router.isReady();
    });

    it('renders category edit vue', async () => {
        const categoriesStore = useCategoriesStore();

        jest.spyOn(categoriesStore, 'findEditCategory').mockResolvedValue(true);

        const wrapper = mount(CategoryEdit, {
            global: {
                plugins: [router, testingPinia],
            },
        });

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Categorias');

        expect(categoriesStore.findEditCategory).toHaveBeenCalledWith(1);
    });
});
