import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import router from '@/router';
import Application from '@/views/Application.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);
localVue.use(Vuex);


describe('Application.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders', () => {
    const wrapper = shallowMount(Application, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
