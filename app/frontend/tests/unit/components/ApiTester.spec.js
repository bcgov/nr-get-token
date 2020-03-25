import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import ApiTester from '@/components/ApiTester.vue';
import testerService from '@/services/testerService';

const localVue = createLocalVue();
localVue.use(Vuetify);

describe('ApiTester.vue', () => {
  const getTestRespSpy = jest.spyOn(testerService, 'getTestResponse');

  beforeEach(() => {
    getTestRespSpy.mockReset();
  });

  it('renders', () => {
    const wrapper = shallowMount(ApiTester, { localVue });

    expect(wrapper.text()).toMatch('API Tester');
  });

  it('can reset the form', async () => {
    const wrapper = shallowMount(ApiTester, { localVue });
    wrapper.setData({ form: { path: 'foo' }, response: 'bar' });
    await wrapper.vm.resetForm();
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('API Tester');
    expect(wrapper.vm.form).toEqual({});
    expect(wrapper.vm.response).toBeFalsy();
  });

  it('can submit the form and handle a response', async () => {
    const resp = 'foo';
    getTestRespSpy.mockResolvedValue({ data: resp });

    const wrapper = shallowMount(ApiTester, { localVue });
    wrapper.setData({ form: { path: 'bar' } });
    await wrapper.vm.testApi();
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('API Tester');
    expect(wrapper.vm.form.path).toMatch('bar');
    expect(wrapper.vm.response).toMatch(resp);
    expect(getTestRespSpy).toHaveBeenCalledTimes(1);
  });

  it('can submit the form and handle an error', async () => {
    const resp = 'foo';
    getTestRespSpy.mockRejectedValue(resp);

    const wrapper = shallowMount(ApiTester, { localVue });
    wrapper.setData({ form: { path: 'bar' } });
    await wrapper.vm.testApi();
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('API Tester');
    expect(wrapper.vm.form.path).toMatch('bar');
    expect(wrapper.vm.response).toMatch(resp);
    expect(getTestRespSpy).toHaveBeenCalledTimes(1);
  });
});
