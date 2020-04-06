import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import MyApps from '@/views/MyApps.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('MyApps.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders', () => {
    const wrapper = shallowMount(MyApps, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
