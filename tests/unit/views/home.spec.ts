import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('HomePage.vue', () => {
    it('renders home vue', () => {
        const wrapper = mount(HomePage);

        expect(wrapper.text()).toMatch('Bem-vindo!');
    });
});
