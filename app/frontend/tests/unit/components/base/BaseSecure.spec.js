import { shallowMount, createLocalVue } from '@vue/test-utils';
import BaseSecure from '@/components/base/BaseSecure.vue';

describe('BaseSecure.vue', () => {
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();

    Object.defineProperty(localVue.prototype, '$keycloak', {
      get() {
        return {
          authenticated: false,
          logoutFn: () => { },
          loginFn: () => { },
          ready: true
        };
      }
    });
  });

  it('renders', () => {
    const wrapper = shallowMount(BaseSecure, { localVue });
    expect(wrapper.text()).toMatch('You must be logged in to use this feature.');
  });
});
