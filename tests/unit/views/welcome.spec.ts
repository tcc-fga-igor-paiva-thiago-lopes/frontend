import { mount } from '@vue/test-utils';

import { initialState } from '@/store/app';
import { createTestingPinia } from '@pinia/testing';

import WelcomePage from '@/views/WelcomePage.vue';

describe('WelcomePage.vue', () => {
    it('renders welcome vue', async () => {
        const wrapper = mount(WelcomePage);

        const button = wrapper.find('ion-button');

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Criar conta');
    });

    it('redirects to signup page when button is clicked', async () => {
        const mockRouter = { push: jest.fn() };

        const wrapper = mount(WelcomePage, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
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
