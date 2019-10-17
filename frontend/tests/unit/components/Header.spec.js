import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import Header from '@/components/Header';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('Header.vue', () => {
  let getters;
  let store;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    getters = {
      isAuthenticated: () => 'false'
    };

    store = new Vuex.Store({
      getters
    });

    wrapper = mount(Header, {
      localVue,
      vuetify,
      store
    });
  });

  it('has the gov link', () => {
    expect(wrapper.html()).toContain('https://www2.gov.bc.ca');
  });
});
