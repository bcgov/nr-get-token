import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import router from '@/router';
import ApplicationList from '@/components/ApplicationList.vue';
import user from '@/store/modules/user.js';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);
localVue.use(Vuex);

describe('ApplicationList.vue', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      getUserAcronyms: jest.fn()
    };

    store = new Vuex.Store({
      modules: {
        user: {
          namespaced: true,
          actions,
          getters: user.getters
        }
      }
    });
  });

  it('renders', () => {
    const wrapper = shallowMount(ApplicationList, {
      store,
      localVue,
      stubs: ['BaseActionCard']
    });
    expect(wrapper.text()).toContain('My Applications');
  });
});
