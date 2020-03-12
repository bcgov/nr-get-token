import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import MyApps from '@/views/MyApps.vue';

describe('MyApps.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders', () => {
    const wrapper = shallowMount(MyApps, {
      vuetify,
      stubs: ['ApplicationList', 'BaseSecure']
    });

    expect(wrapper.html()).toMatch('');
  });
});
