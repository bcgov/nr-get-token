import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Header from '@/components/Header.vue';

describe('Header.vue', () => {
  let getters;
  let store;
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);
    localVue.use(Vuex);

    getters = {
      isAuthenticated: () => 'false'
    };

    store = new Vuex.Store({
      getters
    });

    wrapper = mount(Header, {
      localVue,
      store
    });
  });

  it('has the bcgov link', () => {
    expect(wrapper.html()).toContain('<a href="https://www2.gov.bc.ca">');
  });

  it('has the app title', () => {
    expect(wrapper.html()).toContain('NATURAL RESOURCES GET TOKEN');
  });
});
