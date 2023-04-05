import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';

import SignUp from '@/views/SignUp.vue';

beforeAll(() => {
    setActivePinia(createPinia());
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

        wrapper.findComponent('#truck-driver-name').setValue('John');

        wrapper.findComponent('#truck-driver-email').setValue('john@mail.com');

        wrapper.findComponent('#truck-driver-password').setValue('123');

        wrapper
            .findComponent('#truck-driver-password-confirmation')
            .setValue('321');

        await wrapper.get('ion-button').trigger('click');

        await flushPromises();

        expect(wrapper.find('ion-text>h6').text()).toBe(
            'A senha e confirmação de senha devem ser iguais'
        );
    });
});
