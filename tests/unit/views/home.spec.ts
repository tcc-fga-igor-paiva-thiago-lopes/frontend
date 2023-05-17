import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';
import { DatabaseHelper } from '../../databaseHelper';

beforeAll(async () => {
    setActivePinia(createPinia());

    await DatabaseHelper.instance.setupTestDB();
});

afterAll(() => DatabaseHelper.instance.teardownTestDB);

describe('HomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(HomePage);

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Página inicial');
    });
});
