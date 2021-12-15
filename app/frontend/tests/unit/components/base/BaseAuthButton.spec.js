import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import getRouter from '@/router';
import BaseAuthButton from '@/components/base/BaseAuthButton.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuex);

describe('BaseAuthButton.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders nothing when not authenticated and does not hasLogin', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, router, store });

    expect(wrapper.text()).toEqual('');
  });

  it('renders login when not authenticated and hasLogin', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, router, store });
    wrapper.vm.$route.meta.hasLogin = true;

    expect(wrapper.text()).toMatch('Login');
  });

  it('renders logout when authenticated', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => true,
        keycloakReady: () => true
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, router, store });

    expect(wrapper.text()).toMatch('Logout');
  });

  it('renders nothing if keycloak is not keycloakReady', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        keycloakReady: () => false
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, router, store });

    expect(wrapper.text()).toBeFalsy();
  });

  it('login button redirects to login url', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => false,
        keycloakReady: () => true,
        createLoginUrl: () => () => 'testurl'
      }
    });

    const wrapper = shallowMount(BaseAuthButton, { localVue, router, store });
    wrapper.vm.login();

    expect(wrapper.text()).toMatch('');
  });

  it('logout button redirects to logout url', () => {
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        authenticated: () => true,
        keycloakReady: () => true,
        createLogoutUrl: () => () => 'testurl'
      },
    });

    const wrapper = shallowMount(BaseAuthButton, {
      localVue, router, store, mocks: {
        $config: {
          basePath: 'test'
        }
      }
    });
    wrapper.vm.logout();

    expect(wrapper.text()).toMatch('Logout');
  });
});
