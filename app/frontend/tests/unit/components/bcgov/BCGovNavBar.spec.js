import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import getRouter from '@/router';
import BCGovNavBar from '@/components/bcgov/BCGovNavBar.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);
localVue.use(Vuex);

describe('BCGovNavBar.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders without an admin button', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        isAdmin: () => false
      }
    });

    const wrapper = shallowMount(BCGovNavBar, {
      localVue,
      store,
      stubs: ['router-link', 'router-view']
    });

    expect(wrapper.text()).toContain('About');
    expect(wrapper.text()).toContain('My Applications');
  });

  it('renders with an admin button', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        isAdmin: () => true
      }
    });

    const wrapper = shallowMount(BCGovNavBar, {
      localVue,
      store,
      stubs: ['router-link', 'router-view']
    });

    expect(wrapper.text()).toContain('About');
    expect(wrapper.text()).toContain('My Applications');
    expect(wrapper.text()).toContain('Admin');
  });
});
