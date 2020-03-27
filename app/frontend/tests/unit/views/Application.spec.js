import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import Application from '@/views/Application.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('Application.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Application, {
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
