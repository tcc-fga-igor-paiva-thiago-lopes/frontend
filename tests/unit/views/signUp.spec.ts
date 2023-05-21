import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

import { routes } from '@/router';
import { presentToast } from '@/utils/toast';
import { createTestingPinia } from '@pinia/testing';
import { Preferences } from '@capacitor/preferences';

import SignUp from '@/views/SignUp.vue';
import APIAdapter from '@/services/api';
import { initialState } from '@/store/app';
import APIError from '@/services/api/apiError';
import { getCSSProperty } from '../../helpers';
import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/accountsDataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/utils/toast');

const mockRequestWithoutAuth = jest.fn();

jest.mock('@/services/api', () => {
    return jest.fn().mockImplementation(() => {
        return {
            requestWithoutAuth: mockRequestWithoutAuth,
        };
    });
});

let router: Router;
const presentToastMock = presentToast as jest.Mock<any, any>;

beforeEach(async () => {
    presentToastMock.mockClear();
    mockRequestWithoutAuth.mockClear();

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
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        const button = wrapper.find('form>ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('shows error message when fields are not filled', async () => {
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

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
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

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
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
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
            .setValue('87654321');

        await wrapper.get('form>ion-button').trigger('click');

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
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

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
                plugins: [
                    router,
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        const expectedResponse = {
            status: 201,
            headers: {},
            url: 'http://localhost:5000/truck-drivers',
            data: {
                id: 23,
                name: 'bbbb',
                email: 'bbbb@mail.com',
                last_sign_in_at: null,
                created_at: '2023-04-03 23:40:51.702511+00:00',
                updated_at: '2023-04-03 23:40:51.702511+00:00',
            },
        };

        mockRequestWithoutAuth.mockResolvedValueOnce(expectedResponse);

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

        expect(APIAdapter).toHaveBeenCalled();
        expect(mockRequestWithoutAuth).toHaveBeenCalledWith({
            method: 'POST',
            url: '/truck-drivers/',
            data: {
                name: 'John',
                email: 'john@mail.com',
                password: '12345678',
                password_confirmation: '12345678',
            },
        });

        expect(Preferences.get).toHaveBeenCalledTimes(0);

        expect(presentToastMock).toHaveBeenCalledTimes(1);
        expect(presentToastMock).toHaveBeenCalledWith(
            'Conta criada com sucesso!',
            'success'
        );

        expect(getCSSProperty(nameNote, 'display')).toBeFalsy();
        expect(getCSSProperty(emailNote, 'display')).toBeFalsy();
        expect(getCSSProperty(passwordNote, 'display')).toBeFalsy();
        expect(getCSSProperty(passwordConfirmationNote, 'display')).toBeFalsy();
    });

    it('shows API error message when request fails', async () => {
        const wrapper = mount(SignUp, {
            global: {
                plugins: [
                    router,
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        const expectedResponse = {
            status: 422,
            headers: {},
            url: 'http://localhost:5000/truck-drivers',
            data: { message: 'Email já cadastrado' },
        };

        mockRequestWithoutAuth.mockRejectedValueOnce(
            new APIError(expectedResponse)
        );

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

        expect(mockRequestWithoutAuth).toHaveBeenCalledWith({
            method: 'POST',
            url: '/truck-drivers/',
            data: {
                name: 'John',
                email: 'john@mail.com',
                password: '12345678',
                password_confirmation: '12345678',
            },
        });

        expect(wrapper.find('ion-text>h6').text()).toBe('Email já cadastrado');

        expect(presentToastMock).toHaveBeenCalledTimes(1);
        expect(presentToastMock).toHaveBeenCalledWith(
            'Email já cadastrado',
            'danger'
        );
    });
});
