import { mount } from '@vue/test-utils';

import { initialState } from '@/store/app';
import NotFound from '@/views/NotFound.vue';
import { createTestingPinia } from '@pinia/testing';

describe('NotFound.vue', () => {
    it('renders not found vue', async () => {
        const wrapper = mount(NotFound, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: { application: initialState() },
                    }),
                ],
            },
        });

        const notFoundMsg = wrapper.find('ion-content>div>ion-text');
        const redirectBtn = wrapper.find('ion-content>div>ion-button');

        expect(notFoundMsg.exists()).toBe(true);
        expect(notFoundMsg.text()).toBe('Não encontrado...');

        expect(redirectBtn.exists()).toBe(true);
        expect(redirectBtn.text()).toBe('Ir para página inicial');
    });

    it('redirects to home page when button is clicked', async () => {
        const mockRouter = { push: jest.fn() };

        const wrapper = mount(NotFound, {
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

        await wrapper.get('ion-content>div>ion-button').trigger('click');

        expect(mockRouter.push).toHaveBeenCalledTimes(1);
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'Home' });
    });
});
