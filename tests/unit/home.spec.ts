import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import { TestHelper } from '../testHelper';
import HomePage from '@/views/HomePage.vue';

beforeAll(() => TestHelper.instance.setupTestDB());

afterAll(() => TestHelper.instance.teardownTestDB());

describe('HomePage.vue', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders home vue', () => {
        const wrapper = mount(HomePage);

        expect(wrapper.text()).toMatch('Bem-vindo!');
    });
});
