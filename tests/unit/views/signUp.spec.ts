import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

import { routes } from '@/router';
import APIAdapter from '@/services/api';
import { presentToast } from '@/utils/toast';

import SignUp from '@/views/SignUp.vue';
import { getCSSProperty } from '../../testHelper';

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
    const fieldsOrderMap: Record<string, number> = {
        name: 1,
        email: 2,
        password: 3,
        passwordConfirmation: 4,
    };

    const findInputNote = (wrapper: VueWrapper, field: string) =>
        wrapper.find(
            `ion-item:nth-child(${fieldsOrderMap[field]})>ion-note[slot="error"]`
        );

    const inputQueryString = (field: string) =>
        `ion-item:nth-child(${fieldsOrderMap[field]})>ion-input`;

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

        const nameNote = findInputNote(wrapper, 'name');
        const emailNote = findInputNote(wrapper, 'email');
        const passwordNote = findInputNote(wrapper, 'password');
        const passwordConfirmationNote = findInputNote(
            wrapper,
            'passwordConfirmation'
        );

        expect(getCSSProperty(nameNote, 'display')).toBeFalsy();
        expect(nameNote.text()).toBe('Campo obrigatório');

        expect(getCSSProperty(emailNote, 'display')).toBeFalsy();
        expect(emailNote.text()).toBe('Campo obrigatório');

        expect(getCSSProperty(passwordNote, 'display')).toBeFalsy();
        expect(passwordNote.text()).toBe('Campo obrigatório');

        expect(getCSSProperty(passwordConfirmationNote, 'display')).toBeFalsy();
        expect(passwordConfirmationNote.text()).toBe('Campo obrigatório');

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('shows error message when password length is smaller than 8', async () => {
        const wrapper = mount(SignUp);

        wrapper.findComponent(inputQueryString('name')).setValue('John');

        wrapper
            .findComponent(inputQueryString('email'))
            .setValue('john@mail.com');

        wrapper.findComponent(inputQueryString('password')).setValue('123');

        wrapper
            .findComponent(inputQueryString('passwordConfirmation'))
            .setValue('123');

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        const passwordNote = findInputNote(wrapper, 'password');

        expect(getCSSProperty(passwordNote, 'display')).toBeFalsy();
        expect(passwordNote.text()).toBe(
            'Menor que o tamanho mínimo de 8 caracteres'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('shows error message when password and confirmation are different', async () => {
        const wrapper = mount(SignUp);

        wrapper.findComponent(inputQueryString('name')).setValue('John');

        wrapper
            .findComponent(inputQueryString('email'))
            .setValue('john@mail.com');

        wrapper
            .findComponent(inputQueryString('password'))
            .setValue('12345678');

        wrapper
            .findComponent(inputQueryString('passwordConfirmation'))
            .setValue('87654321');

        await wrapper.get('ion-button').trigger('click');

        await flushPromises();

        const passwordNote = findInputNote(wrapper, 'password');
        const passwordConfirmationNote = findInputNote(
            wrapper,
            'passwordConfirmation'
        );

        expect(getCSSProperty(passwordNote, 'display')).toBeFalsy();
        expect(passwordNote.text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );

        expect(getCSSProperty(passwordConfirmationNote, 'display')).toBeFalsy();
        expect(passwordConfirmationNote.text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('shows error message when email is invalid', async () => {
        const wrapper = mount(SignUp);

        wrapper.findComponent(inputQueryString('email')).setValue('john@mail.');

        await flushPromises();

        const emailNote = findInputNote(wrapper, 'email');

        expect(getCSSProperty(emailNote, 'display')).toBeFalsy();
        expect(emailNote.text()).toBe('E-mail inválido');

        expect(APIAdapter).toHaveBeenCalledTimes(0);
    });

    it('sends request when all required data is filled properly', async () => {
        const wrapper = mount(SignUp, {
            global: {
                plugins: [router],
            },
        });

        wrapper.findComponent(inputQueryString('name')).setValue('John');

        wrapper
            .findComponent(inputQueryString('email'))
            .setValue('john@mail.com');

        wrapper
            .findComponent(inputQueryString('password'))
            .setValue('12345678');

        wrapper
            .findComponent(inputQueryString('passwordConfirmation'))
            .setValue('12345678');

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        const nameNote = findInputNote(wrapper, 'name');
        const emailNote = findInputNote(wrapper, 'email');
        const passwordNote = findInputNote(wrapper, 'password');
        const passwordConfirmationNote = findInputNote(
            wrapper,
            'passwordConfirmation'
        );

        expect(APIAdapter).toHaveBeenCalledTimes(1);

        expect(presentToast).toHaveBeenCalledTimes(1);
        expect(presentToast).toHaveBeenCalledWith(
            'Conta criada com sucesso!',
            'success'
        );

        expect(getCSSProperty(nameNote, 'display')).toBeFalsy();
        expect(getCSSProperty(emailNote, 'display')).toBeFalsy();
        expect(getCSSProperty(passwordNote, 'display')).toBeFalsy();
        expect(getCSSProperty(passwordConfirmationNote, 'display')).toBeFalsy();
    });
});
