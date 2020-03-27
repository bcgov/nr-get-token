import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import HealthDialog from '@/components/HealthDialog.vue';
import healthService from '@/services/healthService';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('HealthDialog.vue', () => {
  const getHealthCheckSpy = jest.spyOn(healthService, 'getHealthCheck');

  beforeEach(() => {
    getHealthCheckSpy.mockReset();
  });

  it('renders', () => {
    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.text()).toMatch('Check the health of related API endpoints');
  });

  it('getHealthCheck updates data fields on successful call', async () => {
    const response = { data: { endpoints: [] } };
    getHealthCheckSpy.mockResolvedValue(response);

    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });
    await wrapper.vm.getHealthCheck();
    await localVue.nextTick();

    expect(wrapper.vm.healthStatus).toEqual(response.data);
    expect(wrapper.vm.loaded).toBeTruthy();
    expect(getHealthCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('getHealthCheck updates data fields on failed call', async () => {
    getHealthCheckSpy.mockRejectedValue();

    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });
    await wrapper.vm.getHealthCheck();
    await localVue.nextTick();

    expect(wrapper.vm.healthStatus).toEqual({});
    expect(wrapper.vm.loaded).toBeTruthy();
    expect(getHealthCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('getStatusColor returns the right color based on status', () => {
    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.vm.getStatusColor(true)).toMatch('success');
    expect(wrapper.vm.getStatusColor(false)).toMatch('error');
  });

  it('getStatusIcon returns the right icon based on status', () => {
    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });

    expect(wrapper.vm.getStatusIcon(true)).toMatch('mdi-thumb-up');
    expect(wrapper.vm.getStatusIcon(false)).toMatch('mdi-thumb-down');
  });

  it('onHealthClick displays the dialog and calls getHealthCheck', async () => {
    getHealthCheckSpy.mockResolvedValue();

    const wrapper = shallowMount(HealthDialog, {
      localVue,
      stubs: ['BaseDialog']
    });
    await wrapper.vm.onHealthClick();
    await localVue.nextTick();

    expect(wrapper.vm.healthShow).toBeTruthy();
    expect(getHealthCheckSpy).toHaveBeenCalledTimes(1);
  });
});
