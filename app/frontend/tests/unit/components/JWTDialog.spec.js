import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import JWTDialog from '@/components/JWTDialog.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('JWTDialog.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(JWTDialog, {
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.text()).toMatch('JWT Token');
  });
});
