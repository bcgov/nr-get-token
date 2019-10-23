import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import WebAdeVisualizer from '@/components/webAdeVisualizer/WebAdeVisualizer';
import auth from '@/store/modules/auth';
import webadeVisualizer from '@/store/modules/webadeVisualizer';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('WebAdeVisualizer.vue', () => {
  let store;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    store = new Vuex.Store({
      state: {},
      modules: {
        webadeVisualizer,
        auth
      }
    });

    wrapper = mount(WebAdeVisualizer, {
      localVue,
      vuetify,
      store
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('Application Acronym');
  });
});
