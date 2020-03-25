import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import JWTDialog from '@/components/JWTDialog.vue';

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(Vuetify);

describe('JWTDialog.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(JWTDialog, {
      localVue,
      stubs: ['BaseDialog'],
      vuetify
    });

    expect(wrapper.text()).toMatch('JWT Token');
  });
});
