import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import { Router, createRouter, createWebHistory } from 'vue-router';

import { routes } from '@/router';
import { presentToast } from '@/utils/toast';
import { Preferences } from '@capacitor/preferences';

import Categories from '@/views/Categories.vue';
import { getCSSProperty } from '../../helpers';
import APIAdapter from '@/services/api';
import APIError from '@/services/api/apiError';

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

beforeAll(() => {
    setActivePinia(createPinia());
});

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

describe('Categories.vue', () => {
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
        const wrapper = mount(Categories);

        const button = wrapper.find('form>ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar grupo');
    });
});
