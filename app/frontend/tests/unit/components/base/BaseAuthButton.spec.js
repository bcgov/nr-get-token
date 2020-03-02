import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import BaseAuthButton from '@/components/base/BaseAuthButton.vue';

describe('BaseAuthButton.vue', () => {
  let localVue;
  let mockKeycloak;
  let vuetify;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    vuetify = new Vuetify();

    Object.defineProperty(localVue.prototype, '$keycloak', {
      get() {
        return mockKeycloak;
      }
    });
  });

  it('renders login when not authenticated', () => {
    mockKeycloak = {
      authenticated: false,
      logoutFn: () => { },
      loginFn: () => { },
      ready: true
    };

    const wrapper = shallowMount(BaseAuthButton, { localVue, vuetify });
    expect(wrapper.text()).toMatch('Login');
  });

  it('renders logout when authenticated', () => {
    mockKeycloak = {
      authenticated: true,
      logoutFn: () => { },
      loginFn: () => { },
      ready: true
    };

    const wrapper = shallowMount(BaseAuthButton, { localVue, vuetify });
    expect(wrapper.text()).toMatch('Logout');
  });

  it('renders nothing if keycloak is not ready', () => {
    mockKeycloak = {
      authenticated: false,
      logoutFn: () => { },
      loginFn: () => { },
      ready: false
    };

    const wrapper = shallowMount(BaseAuthButton, { localVue, vuetify });
    expect(wrapper.text()).toBeFalsy();
  });
});
