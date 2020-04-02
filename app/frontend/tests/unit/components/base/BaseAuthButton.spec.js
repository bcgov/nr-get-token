import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BaseAuthButton from '@/components/base/BaseAuthButton.vue';

const localVue = createLocalVue();
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
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store });

    expect(wrapper.text()).toMatch('Login');
  });

  it('renders logout when authenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => true,
        createLoginUrl: () => 'test',
        createLogoutUrl: () => 'test',
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store });

    expect(wrapper.text()).toMatch('Logout');
  });

  it('renders nothing if keycloak is not keycloakReady', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        createLoginUrl: () => 'test',
        createLogoutUrl: () => 'test',
        keycloakReady: () => false
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, store });

    expect(wrapper.text()).toBeFalsy();
  });
});
