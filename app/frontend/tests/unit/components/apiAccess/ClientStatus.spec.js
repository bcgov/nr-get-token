import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';

import ClientStatus from '@/components/apiAccess/ClientStatus.vue';
import { KcClientStatus } from '@/utils/constants';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('ClientStatus.vue', () => {
  it('renders dev as created if created', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'DEV',
        clientStatuses: {
          dev: { clientId: 'ZZZZ_SERVICE_CLIENT' }
        }
      }
    });
    expect(wrapper.html()).toContain('DEV:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.CREATED);
  });

  it('renders dev as ready if not created', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'DEV',
        clientStatuses: {
          dev: null
        }
      }
    });
    expect(wrapper.html()).toContain('DEV:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.READY);
  });

  it('renders test as created if created', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'TEST',
        clientStatuses: {
          test: { clientId: 'ZZZZ_SERVICE_CLIENT' }
        }
      }
    });
    expect(wrapper.html()).toContain('TEST:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.CREATED);
  });

  it('renders test as ready if not created and dev exists', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'TEST',
        clientStatuses: {
          dev: { clientId: 'ZZZZ_SERVICE_CLIENT' },
          test: null
        }
      }
    });
    expect(wrapper.html()).toContain('TEST:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.READY);
  });

  it('renders test as not available if not created and dev does not exist', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'TEST',
        clientStatuses: {
          dev: null,
          test: null
        }
      }
    });
    expect(wrapper.html()).toContain('TEST:');
    expect(wrapper.html()).not.toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.NOT);
  });

  it('renders prod as created if created', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'PROD',
        clientStatuses: {
          prod: { clientId: 'ZZZZ_SERVICE_CLIENT' }
        }
      }
    });
    expect(wrapper.html()).toContain('PROD:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.CREATED);
  });

  it('renders prod as ready if not created and test exists', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'PROD',
        clientStatuses: {
          test: { clientId: 'ZZZZ_SERVICE_CLIENT' },
          prod: null
        }
      }
    });
    expect(wrapper.html()).toContain('PROD:');
    expect(wrapper.html()).toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.READY);
  });

  it('renders prod as not available if not created and test does not exist', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'PROD',
        clientStatuses: {
          test: null,
          prod: null
        }
      }
    });
    expect(wrapper.html()).toContain('PROD:');
    expect(wrapper.html()).not.toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.NOT);
  });


  it('renders not available if invalid statuses are passed', () => {
    const wrapper = shallowMount(ClientStatus, {
      localVue,
      propsData: {
        env: 'TEST',
        clientStatuses: {
          blah: 'wrong'
        }
      }
    });
    expect(wrapper.html()).toContain('TEST:');
    expect(wrapper.html()).not.toContain('green--text');
    expect(wrapper.html()).toContain(KcClientStatus.NOT);
  });
});
