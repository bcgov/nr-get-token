import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import BaseDialog from '@/components/base/BaseDialog.vue';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('BaseDialog.vue', () => {
  it('renders', async () => {
    const wrapper = shallowMount(BaseDialog, { localVue });
    await wrapper.vm.closeDialog();
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('OK');
  });
});
