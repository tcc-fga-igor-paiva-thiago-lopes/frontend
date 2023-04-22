import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';
import { TestHelper } from '../../testHelper';

beforeAll(async () => {
    setActivePinia(createPinia());

    await TestHelper.instance.setupTestDB();
});

afterAll(() => TestHelper.instance.teardownTestDB);

describe('HomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(HomePage);

        const message = wrapper.find('ion-toolbar>ion-title');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Página inicial');
    });
});
