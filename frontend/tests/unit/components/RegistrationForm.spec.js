import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import RegistrationForm from '@/components/RegistrationForm';
import auth from '@/store/modules/auth';

const localVue = createLocalVue();

localVue.use(Vuetify);
localVue.use(Vuex);

describe('RegistrationForm.vue', () => {
  let store;
  let vuetify;
  let wrapper;

  beforeEach(() => {

    vuetify = new Vuetify();

    store = new Vuex.Store({
      state: {},
      modules: {
        auth
      }
    });

    wrapper = mount(RegistrationForm, {
      localVue,
      vuetify,
      store
    });

    // prevent 'Unable to locate target [data-app]' warning
    // caused by dialog not having data-app attribute when mounted
    const el = document.createElement('div')
    el.setAttribute('data-app', true)
    document.body.appendChild(el)

  });


  it('renders registration form content', () => {
    wrapper.find('button').trigger('click');
    expect(wrapper.find('.v-dialog--active').text()).toContain('Request Permission');
  });

  it('opens registration form modal when button is clicked', () => {
    wrapper.find('button').trigger('click');
    expect(wrapper.find('.v-dialog--active').exists()).toBe(true);
  });



});
