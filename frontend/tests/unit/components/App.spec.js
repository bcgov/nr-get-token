import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);
localVue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;
  let getters;
  let vuetify;
  let store;

  beforeEach(() => {
    vuetify = new Vuetify();

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
      vuetify,
      router
    });
  });

  it('exists', () => {
    expect(wrapper).toBeTruthy();
  });
});

