import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import JWTDialog from '@/components/admin/JWTDialog.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('JWTDialog.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({});
  });

  it('renders', () => {
    const fullName = 'Full Name';
    store.registerModule('auth', {
      namespaced: true,
      getters: {
        fullName: () => fullName
      }
    });

    const wrapper = shallowMount(JWTDialog, {
      store,
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.text()).toMatch(`${fullName}'s JSON Web Token (JWT)`);
  });
});
