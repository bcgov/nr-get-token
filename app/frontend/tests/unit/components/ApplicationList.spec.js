import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import router from '@/router';
import ApplicationList from '@/components/ApplicationList.vue';

const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);

describe('ApplicationList.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(ApplicationList, {
      localVue,
      stubs: ['BaseActionCard']
    });
    expect(wrapper.text()).toContain('My Applications');
  });
});
