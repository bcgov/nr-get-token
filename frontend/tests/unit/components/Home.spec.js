import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Home from '@/components/Home.vue';

describe('Home.vue', () => {
  let getters;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);
    localVue.use(Vuex);

    getters = {
      isAuthenticated: () => 'false'
    };

    actions = {
      getHealthCheckStatus: jest.fn()
    };

    store = new Vuex.Store({
      getters, actions
    });

    wrapper = mount(Home, {
      localVue,
      store
    });
  });

  it('has the app config panel', () => {
    expect(wrapper.html()).toContain('Please log in');
  });
});
