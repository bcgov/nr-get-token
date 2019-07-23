import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import HealthCheck from '@/components/HealthCheck.vue';

describe('HealthCheck.vue', () => {
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

    wrapper = mount(HealthCheck, {
      localVue,
      store
    });
  });

  it('loads with a progress spinner', () => {
    expect(wrapper.html()).toContain('v-progress-circular');
  });
});
