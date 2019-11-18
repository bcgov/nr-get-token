import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import ApiCheck from '@/components/ApiCheck';
import checks from '@/store/modules/checks';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('ApiCheck.vue', () => {
  let store;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    store = new Vuex.Store({
      state: {},
      modules: {
        checks
      }
    });

    wrapper = mount(ApiCheck, {
      localVue,
      vuetify,
      store
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('Endpoint');
  });
});
