import { mount } from '@vue/test-utils';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
    it('renders home vue', async () => {
        const wrapper = mount(HomePage);

        const message = wrapper.find('ion-content>ion-text');

        expect(message.exists()).toBe(true);
        expect(message.text()).toBe('Veja suas opções...');
    });
});
