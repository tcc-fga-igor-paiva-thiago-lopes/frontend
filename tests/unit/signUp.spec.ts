import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import SignUp from '@/views/SignUp.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('SignUp.vue', () => {
    it('renders home vue', () => {
        const wrapper = mount(SignUp);

        expect(wrapper.text()).toMatch('Criar conta');
    });
});
