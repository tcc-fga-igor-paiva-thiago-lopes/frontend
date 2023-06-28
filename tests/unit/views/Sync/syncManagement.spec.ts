import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { Preferences } from '@capacitor/preferences';

import { initialState } from '@/store/app';
import SyncManagement from '@/views/Sync/SyncManagement.vue';
import { DatabaseHelper } from '../../../databaseHelper';

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

beforeAll(async () => {
    await DatabaseHelper.instance.setupTestDB(mockDataSource);
});

afterAll(() => DatabaseHelper.instance.teardownTestDB());

describe('SyncManagement.vue', () => {
    it('renders sync management vue', async () => {
        jest.spyOn(Preferences, 'get').mockResolvedValue({ value: null });

        const wrapper = mount(SyncManagement, {
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
        expect(message.text()).toBe('Sincronização');
    });
});
