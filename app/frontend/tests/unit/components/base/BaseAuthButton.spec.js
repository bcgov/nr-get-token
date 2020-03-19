import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import BaseAuthButton from '@/components/base/BaseAuthButton.vue';

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('BaseAuthButton.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders login when not authenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        createLoginUrl: () => 'test',
        createLogoutUrl: () => 'test',
        ready: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store, vuetify });

    expect(wrapper.text()).toMatch('Login');
  });

  it('renders logout when authenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => true,
        createLoginUrl: () => 'test',
        createLogoutUrl: () => 'test',
        ready: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store, vuetify });

    expect(wrapper.text()).toMatch('Logout');
  });

  it('renders nothing if keycloak is not ready', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        createLoginUrl: () => 'test',
        createLogoutUrl: () => 'test',
        ready: () => false
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store, vuetify });
    
    expect(wrapper.text()).toBeFalsy();
  });
});
