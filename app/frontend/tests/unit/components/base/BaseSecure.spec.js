import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BaseSecure from '@/components/base/BaseSecure.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('BaseSecure.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders nothing if authenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => true,
        createLoginUrl: () => 'test',
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseSecure, { localVue, store });

    expect(wrapper.text()).toMatch('');
  });

  it('renders a message with login button if unauthenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        createLoginUrl: () => 'test',
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseSecure, { localVue, store });

    expect(wrapper.text()).toMatch('You must be logged in to use this feature.');
    expect(wrapper.text()).toMatch('mdi-login');
  });

  it('renders a message without login button if unauthenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        createLoginUrl: () => 'test',
        keycloakReady: () => false
      }
    });

    const wrapper = shallowMount(BaseSecure, { localVue, store });

    expect(wrapper.text()).toMatch('You must be logged in to use this feature.');
  });
});
