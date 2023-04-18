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

        const button = wrapper.find('form>ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('shows error message when fields are not filled', async () => {
        const wrapper = mount(SignUp);

        wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        expect(wrapper.find('ion-text>h6').text()).toBe(
            'Todos os campos com * são obrigatórios'
        );

        const nameNote = wrapper.find('ion-item:nth-child(1)>ion-note');
        const emailNote = wrapper.find(
            'ion-item:nth-child(2)>ion-note[slot="error"]'
        );
        const passwordNote = wrapper.find('ion-item:nth-child(3)>ion-note');
        const passwordConfirmationNote = wrapper.find(
            'ion-item:nth-child(4)>ion-note[slot="error"]'
        );

        expect(
            getComputedStyle(nameNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(nameNote.text()).toBe('Campo obrigatório');

        expect(
            getComputedStyle(emailNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(emailNote.text()).toBe('Campo obrigatório');

        expect(
            getComputedStyle(passwordNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(passwordNote.text()).toBe('Campo obrigatório');

        expect(
            getComputedStyle(passwordConfirmationNote.element).getPropertyValue(
                'display'
            )
        ).toBeFalsy();

        expect(passwordConfirmationNote.text()).toBe('Campo obrigatório');

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('shows error message when password length is smaller than 8', async () => {
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
            .setValue('123');

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        const passwordNote = wrapper.find('ion-item:nth-child(3)>ion-note');

        expect(
            getComputedStyle(passwordNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(passwordNote.text()).toBe(
            'Menor que o tamanho mínimo de 8 caracteres'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(0);
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
            .setValue('12345678');

        wrapper
            .findComponent('ion-item:nth-child(4)>ion-input')
            .setValue('87654321');

        await wrapper.get('ion-button').trigger('click');

        await flushPromises();

        const passwordNote = wrapper.find('ion-item:nth-child(3)>ion-note');
        const passwordConfirmationNote = wrapper.find(
            'ion-item:nth-child(4)>ion-note[slot="error"]'
        );

        expect(
            getComputedStyle(passwordNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(passwordNote.text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );

        expect(
            getComputedStyle(passwordConfirmationNote.element).getPropertyValue(
                'display'
            )
        ).toBeFalsy();

        expect(passwordConfirmationNote.text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('shows error message when email is invalid', async () => {
        const wrapper = mount(SignUp);

        wrapper
            .findComponent('ion-item:nth-child(2)>ion-input')
            .setValue('john@mail.');

        await flushPromises();

        const emailNote = wrapper.find(
            'ion-item:nth-child(2)>ion-note[slot="error"]'
        );

        expect(
            getComputedStyle(emailNote.element).getPropertyValue('display')
        ).toBeFalsy();

        expect(emailNote.text()).toBe('E-mail inválido');

        expect(APIAdapter).toHaveBeenCalledTimes(0);
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
            .setValue('12345678');

        wrapper
            .findComponent('ion-item:nth-child(4)>ion-input')
            .setValue('12345678');

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        expect(APIAdapter).toHaveBeenCalledTimes(1);

        expect(presentToast).toHaveBeenCalledTimes(1);
        expect(presentToast).toHaveBeenCalledWith(
            'Conta criada com sucesso!',
            'success'
        );
    });
});
