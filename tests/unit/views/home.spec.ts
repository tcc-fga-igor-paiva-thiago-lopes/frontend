import { mount } from '@vue/test-utils';

import { initialState } from '@/store/app';
import HomePage from '@/views/HomePage.vue';
import { createTestingPinia } from '@pinia/testing';
import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/databaseDataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

beforeAll(async () => {
    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB);

describe('HomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(HomePage, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Página inicial');
    });
});
