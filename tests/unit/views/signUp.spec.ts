import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

import { routes } from '@/router';
import APIAdapter from '@/services/api';
import { presentToast } from '@/utils/toast';

import SignUp from '@/views/SignUp.vue';

jest.mock('@/services/api');
jest.mock('@/utils/toast');

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

describe('SignUp.vue', () => {
    it('renders signup vue', () => {
        const wrapper = mount(SignUp);

        const button = wrapper.find('ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('shows error message when fields are not filled', async () => {
        const wrapper = mount(SignUp);

        wrapper.get('ion-button').trigger('click');

        await flushPromises();

        expect(wrapper.find('ion-text>h6').text()).toBe(
            'Todos os campos com * são obrigatórios'
        );
    });

    it('shows error message when password and confirmation are different', async () => {
        const wrapper = mount(SignUp);

        wrapper
            .findComponent('ion-item:nth-child(1)>ion-input')
            .setValue('John');

        wrapper
            .findComponent('ion-item:nth-child(2)>ion-input')
            .setValue('john@mail.com');

        wrapper
            .findComponent('ion-item:nth-child(3)>ion-input')
            .setValue('123');

        wrapper
            .findComponent('ion-item:nth-child(4)>ion-input')
            .setValue('321');

        await wrapper.get('ion-button').trigger('click');

        await flushPromises();

        expect(wrapper.find('ion-text>h6').text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );
    });

    it('sends request when all required data is filled properly', async () => {
        const wrapper = mount(SignUp, {
            global: {
                plugins: [router],
            },
        });

        wrapper
            .findComponent('ion-item:nth-child(1)>ion-input')
            .setValue('John');

        wrapper
            .findComponent('ion-item:nth-child(2)>ion-input')
            .setValue('john@mail.com');

        wrapper
            .findComponent('ion-item:nth-child(3)>ion-input')
            .setValue('123');

        wrapper
            .findComponent('ion-item:nth-child(4)>ion-input')
            .setValue('123');

        await wrapper.get('ion-button').trigger('click');

        await flushPromises();

        expect(APIAdapter).toHaveBeenCalledTimes(1);

        expect(presentToast).toHaveBeenCalledTimes(1);
        expect(presentToast).toHaveBeenCalledWith(
            'Conta criada com sucesso!',
            'success'
        );
    });
});
