import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import ConfigForm from '@/components/ConfigForm';
import auth from '@/store/modules/auth';
import configForm from '@/store/modules/configForm';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('ConfigForm.vue', () => {
  let store;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    store = new Vuex.Store({
      state: {},
      modules: {
        auth,
        configForm
      }
    });

    wrapper = mount(ConfigForm, {
      localVue,
      vuetify,
      store
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('Check your acronym access permissions');
  });
});
