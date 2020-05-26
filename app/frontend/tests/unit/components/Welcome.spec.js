import { createLocalVue, shallowMount } from '@vue/test-utils';

import getRouter from '@/router';
import Welcome from '@/components/Welcome.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);

describe('Welcome.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(Welcome, { localVue });
    expect(wrapper.text()).toMatch('GETOK Common Service Onboarding');
  });
});
