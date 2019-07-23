import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import Vuex from 'vuex';

describe('App.vue', () => {
  let wrapper;
  let getters;
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();

    localVue.use(Vuetify);
    localVue.use(Vuex);
    localVue.use(VueRouter);
    getters = {
      isAuthenticated: () => 'false'
    };

    store = new Vuex.Store({
      getters
    });

    const router = new VueRouter();
    wrapper = mount(App, {
      localVue,
      store,
      router
    });
  });

  it('exists', () => {
    expect(wrapper).toBeTruthy();
  });
});

