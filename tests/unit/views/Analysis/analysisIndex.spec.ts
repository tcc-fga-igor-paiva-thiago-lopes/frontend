import { mount } from '@vue/test-utils';

import { initialState } from '@/store/app';
import { createTestingPinia } from '@pinia/testing';
import { DatabaseHelper } from '../../../databaseHelper';

import AnalysisIndex from '@/views/Analysis/AnalysisIndex.vue';

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

describe('AnalysisIndex.vue', () => {
    it('renders analysis index vue', async () => {
        const wrapper = mount(AnalysisIndex, {
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
        expect(message.text()).toBe('Indicadores');

        const items = wrapper
            .findAll('ion-list>ion-item')
            .map((item) => item.find('ion-label>h2').text());

        expect(items).toEqual([
            'Tipo de carga, contratante e trajeto',
            'Lucro por período',
        ]);
    });
});
