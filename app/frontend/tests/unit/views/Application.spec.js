import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import Application from '@/views/Application.vue';

describe('Application.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders', () => {
    const wrapper = shallowMount(Application, {
      vuetify,
      stubs: ['ApplicationList', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
