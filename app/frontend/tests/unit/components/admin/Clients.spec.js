import { createLocalVue, shallowMount } from '@vue/test-utils';

import getRouter from '@/router';
import ServiceClients from '@/components/admin/ServiceClients.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);

describe('ServiceClients.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(ServiceClients, { localVue });
    expect(wrapper.text()).toMatch('Service Clients');
  });
});
