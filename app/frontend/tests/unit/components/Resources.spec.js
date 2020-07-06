import { createLocalVue, shallowMount } from '@vue/test-utils';

import getRouter from '@/router';
import Resources from '@/components/Resources.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);

describe('Resources.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Resources, { localVue });
    expect(wrapper.text()).toMatch('Common Services Documentation');
  });
});
