import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

import { routes } from '@/router';
import APIAdapter from '@/services/api';

import SignIn from '@/views/SignIn.vue';

jest.mock('@/services/api');

let router: Router;

beforeAll(() => {
    setActivePinia(createPinia());
});

beforeEach(async () => {
    router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    router.push('/');
    await router.isReady();
});

describe('SignIn.vue', () => {
    const fieldsOrderMap: Record<string, number> = {
        email: 1,
        password: 2,
    };

    const inputQueryString = (field: string) =>
        `ion-item:nth-child(${fieldsOrderMap[field]})>ion-input`;

    it('renders signin vue', () => {
        const wrapper = mount(SignIn);

        const button = wrapper.find('form>ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Login');
    });

    it('shows error message when fields are not filled', async () => {
        const wrapper = mount(SignIn);

        wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        expect(wrapper.find('ion-text>h6').text()).toBe(
            'Todos os campos com * são obrigatórios'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('sends request when all required data is filled properly', async () => {
        const wrapper = mount(SignIn, {
            global: {
                plugins: [router],
            },
        });

        const validEmail = 'john@mail.com';
        const validPassword = '12345678';

        wrapper.findComponent(inputQueryString('email')).setValue(validEmail);

        wrapper
            .findComponent(inputQueryString('password'))
            .setValue(validPassword);

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();
    });
});
