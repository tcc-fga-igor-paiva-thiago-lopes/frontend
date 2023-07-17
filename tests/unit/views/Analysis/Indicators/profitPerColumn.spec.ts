import { mount } from '@vue/test-utils';
import { setupJestCanvasMock } from 'jest-canvas-mock';

import { initialState } from '@/store/app';
import { createTestingPinia } from '@pinia/testing';
import { DatabaseHelper } from '../../../../databaseHelper';

import ProfitPerColumn from '@/views/Analysis/Indicators/ProfitPerColumn.vue';

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

describe('ProfitPerColumn.vue', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        setupJestCanvasMock();
    });

    it('renders profit per column vue', async () => {
        const wrapper = mount(ProfitPerColumn, {
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
    });
});
