import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import WelcomePage from '@/views/WelcomePage.vue';

beforeAll(() => {
    setActivePinia(createPinia());
});

describe('WelcomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(WelcomePage);

        const button = wrapper.find('ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('redirects to signup page when button is clicked', async () => {
        const mockRouter = { push: jest.fn() };

        const wrapper = mount(WelcomePage, {
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
