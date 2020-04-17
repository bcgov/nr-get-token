import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import getRouter from '@/router';
import router from '@/router';
import acronymService from '@/services/acronymService';
import Application from '@/views/Application.vue';

const router = getRouter();
const localVue = createLocalVue();
localVue.use(router);
localVue.use(Vuetify);
localVue.use(Vuex);


describe('Application.vue', () => {
  const acronymSpy = jest.spyOn(acronymService, 'getAcronym');
  let store;

  beforeEach(() => {
    store = new Vuex.Store();
  });

  it('renders correctly when acronym result comes back with webade permission', async () => {
    acronymSpy.mockResolvedValue({ data: { acronym: { acronym: 'XXX', permissionWebade: true } } });

    store.registerModule('auth', {
      namespaced: true,
      getters: {
        hasWebadePermission: () => true
      }
    });

    const wrapper = shallowMount(Application, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });
    await localVue.nextTick();

    expect(wrapper.vm.acronymDetail).toEqual({ acronym: 'XXX', permissionWebade: true });
    expect(wrapper.vm.showWebadeTab).toEqual(true);
    expect(wrapper.text()).toContain('WEBADE ACCESS');
  });

  it('renders correctly when acronym result comes back without webade permission', async () => {
    acronymSpy.mockResolvedValue({ data: { acronym: { acronym: 'XXX', permissionWebade: false } } });

    store.registerModule('auth', {
      namespaced: true,
      getters: {
        hasWebadePermission: () => true
      }
    });

    const wrapper = shallowMount(Application, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });
    await localVue.nextTick();

    expect(wrapper.vm.acronymDetail).toEqual({ acronym: 'XXX', permissionWebade: false });
    expect(wrapper.vm.showWebadeTab).toEqual(false);
    expect(wrapper.text()).not.toContain('WEBADE ACCESS');
  });

  it('renders correctly when acronym result comes back with webade permission but user is not allowed', async () => {
    acronymSpy.mockResolvedValue({ data: { acronym: { acronym: 'XXX', permissionWebade: true } } });

    store.registerModule('auth', {
      namespaced: true,
      getters: {
        hasWebadePermission: () => false
      }
    });

    const wrapper = shallowMount(Application, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });
    await localVue.nextTick();

    expect(wrapper.vm.showWebadeTab).toEqual(false);
    expect(wrapper.text()).not.toContain('WEBADE ACCESS');
  });

  it('renders correctly when acronym call fails', async () => {
    acronymSpy.mockResolvedValue({ data: { acronym: 'XXX', permissionWebade: true } });

    store.registerModule('auth', {
      namespaced: true,
      getters: {
        hasWebadePermission: () => false
      }
    });

    const wrapper = shallowMount(Application, {
      store,
      localVue,
      stubs: ['ApplicationList', 'BaseSecure']
    });
    await localVue.nextTick();

    expect(wrapper.vm.showWebadeTab).toEqual(false);
    expect(wrapper.text()).not.toContain('WEBADE ACCESS');
  });
});

describe('Application.vue - showWebadeTab computed', () => {
  it('returns false for null acronym detail', () => {
    const localThis = { acronymDetail: null, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for undefined acronym detail', () => {
    const localThis = { acronymDetail: null, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for empty acronym detail', () => {
    const localThis = { acronymDetail: {}, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for false acronym webade permission', () => {
    const localThis = { acronymDetail: { acronym: 'XXX', permissionWebade: false }, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for undefined acronym webade permission', () => {
    const localThis = { acronymDetail: { acronym: 'XXX' }, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for no user webade permission', () => {
    const localThis = { acronymDetail: { acronym: 'XXX', permissionWebade: true }, hasWebadePermission: false };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns false for undefined user webade permission', () => {
    const localThis = { acronymDetail: { acronym: 'XXX', permissionWebade: true }, hasWebadePermission: undefined };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(false);
  });

  it('returns true for acronym webade permission', () => {
    const localThis = { acronymDetail: { acronym: 'XXX', permissionWebade: true }, hasWebadePermission: true };
    expect(Application.computed.showWebadeTab.call(localThis)).toBe(true);
  });
});
