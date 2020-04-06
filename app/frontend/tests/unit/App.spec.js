import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('App.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(App, {
      localVue,
      stubs: [
        'BCGovHeader',
        'BCGovNavBar',
        'BCGovFooter'
      ]
    });

    expect(wrapper.text()).toMatch('');
    expect(wrapper.html()).toMatch('v-app');
    expect(wrapper.html()).toMatch('router-view');
  });
});
