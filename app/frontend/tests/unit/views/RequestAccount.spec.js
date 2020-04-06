import { shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import RequestAccount from '@/views/RequestAccount.vue';

describe('Secure.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders', () => {
    const wrapper = shallowMount(RequestAccount, {
      vuetify,
      stubs: ['BaseSecure', 'RequestForm']
    });

    expect(wrapper.text()).toMatch('Request Account');
  });
});
