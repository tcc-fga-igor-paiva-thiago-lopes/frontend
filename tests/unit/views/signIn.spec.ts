import { createTestingPinia } from '@pinia/testing';
import { mount, flushPromises } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

const mockRequestWithoutAuth = jest.fn();

import { routes } from '@/router';
import SignIn from '@/views/SignIn.vue';
import { initialState } from '@/store/app';
import { DatabaseHelper } from '../../databaseHelper';

const mockDataSource = DatabaseHelper.dataSource();

jest.mock('@/database/dataSource', () => {
    return jest.fn().mockImplementation(() => ({
        __esModule: true,
        default: mockDataSource,
    }));
});

jest.mock('@/database', () => {
    return jest.fn().mockImplementation(() => ({ default: {} }));
});

jest.mock('@/services/api', () => {
    return jest.fn().mockImplementation(() => {
        return {
            requestWithoutAuth: mockRequestWithoutAuth,
        };
    });
});

let router: Router;

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
        const wrapper = mount(SignIn, {
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
        expect(button.text()).toBe('Login');
    });

    it('shows error message when fields are not filled', async () => {
        const wrapper = mount(SignIn, {
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

        expect(mockRequestWithoutAuth).toHaveBeenCalledTimes(0);
    });

    it('sends request when all required data is filled properly', async () => {
        const expectedResponse = {
            status: 200,
            headers: {},
            url: 'http://localhost:5000/truck-drivers/login',
            data: {
                name: 'Igor Paiva',
                token: 'eyJhbGciOiJ',
            },
        };

        const wrapper = mount(SignIn, {
            global: {
                plugins: [
                    router,
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        mockRequestWithoutAuth.mockResolvedValueOnce(expectedResponse);

        const validEmail = 'john@mail.com';
        const validPassword = '12345678';

        wrapper.findComponent(inputQueryString('email')).setValue(validEmail);

        wrapper
            .findComponent(inputQueryString('password'))
            .setValue(validPassword);

        await wrapper.get('form>ion-button').trigger('click');

        await flushPromises();

        expect(mockRequestWithoutAuth).toHaveBeenCalledWith({
            method: 'POST',
            url: '/truck-drivers/login',
            data: {
                email: validEmail,
                password: validPassword,
            },
        });
    });
});
