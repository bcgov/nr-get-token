import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import SecurityUtils from '@/components/webAdeVisualizer/SecurityUtils';
import ApiService from '@/common/apiService';

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(Vuex);

describe('SecurityUtils.vue', () => {
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();

    wrapper = mount(SecurityUtils, {
      localVue,
      vuetify,
      sync: false
    });
  });

  it('renders', () => {
    expect(wrapper.html()).toContain('Plain-text password alert');
  });

  it('does not search if the form is not valid', async () => {

    wrapper.vm.environment = '';
    wrapper.vm.prefRegex = '';

    await Vue.nextTick();

    await wrapper.vm.search();

    expect(wrapper.vm.searching).toBe(false);
    expect(wrapper.vm.insecurePasswordsList).toBe(null);
    expect(wrapper.vm.errorMessage).toBe('');
    expect(wrapper.html()).toContain('Enter a Regex to search on');
  });

  it('searches', async () => {
    wrapper.vm.$refs.form.validate = jest.fn().mockReturnValue(true);
    ApiService.getInsecurePasswords = jest.fn().mockReturnValue(['A', 'B']);
    const spy = jest.spyOn(ApiService, 'getInsecurePasswords');

    await wrapper.vm.search();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.searching).toBe(false);
    expect(wrapper.vm.insecurePasswordsList).toEqual(['A', 'B']);
    expect(wrapper.vm.errorMessage).toBe('');
  });

  it('shows an error when the response is empty', async () => {
    wrapper.vm.$refs.form.validate = jest.fn().mockReturnValue(true);
    ApiService.getInsecurePasswords = jest.fn().mockReturnValue(null);
    const spy = jest.spyOn(ApiService, 'getInsecurePasswords');

    await wrapper.vm.search();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.searching).toBe(false);
    expect(wrapper.vm.insecurePasswordsList).toBe(null);
    expect(wrapper.vm.errorMessage).toBe('Error occurred trying to fetch preferences.');
  });

  it('shows an error when the an exception is thrown', async () => {
    wrapper.vm.$refs.form.validate = jest.fn().mockReturnValue(true);
    ApiService.getInsecurePasswords = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    const spy = jest.spyOn(ApiService, 'getInsecurePasswords');

    await wrapper.vm.search();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.searching).toBe(false);
    expect(wrapper.vm.insecurePasswordsList).toBe(null);
    expect(wrapper.vm.errorMessage).toBe('Error occurred trying to fetch preferences.');
  });
});
