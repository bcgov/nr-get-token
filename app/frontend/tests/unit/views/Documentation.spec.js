import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import Documentation from '@/views/Documentation.vue';

describe('Documentation.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders', () => {
    const wrapper = shallowMount(Documentation, {
      vuetify,
      stubs: ['Resources']
    });

    expect(wrapper.html()).toMatch('');
  });
});
