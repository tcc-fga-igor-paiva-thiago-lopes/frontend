import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import HomePage from '@/views/HomePage.vue';

describe('HomePage.vue', () => {
    beforeEach(() => {
        // creates a fresh pinia and make it active so it's automatically picked
        // up by any useStore() call without having to pass it to it:
        // `useStore(pinia)`
        setActivePinia(createPinia());
    });

    it('renders home vue', () => {
        const wrapper = mount(HomePage);
        expect(wrapper.text()).toMatch('Blank');
    });
});
