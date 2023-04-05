import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('HomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(HomePage);

        const button = wrapper.find('ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('redirects to signup page when button is clicked', async () => {
        const mockRouter = { push: jest.fn() };

        const wrapper = mount(HomePage, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });

        await wrapper.get('ion-button').trigger('click');

        expect(mockRouter.push).toHaveBeenCalledTimes(1);
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'SignUp' });
    });
});
