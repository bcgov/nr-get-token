import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import checksStore from '@/store/modules/checks';
import { cloneDeep } from 'lodash';


describe('checks.js', () => {
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(checksStore));
  });

  it('updates "healthCheck" value when "setHealthCheck" is commited', () => {
    expect(store.state.healthCheck).toBe(null);
    store.commit('setHealthCheck', 'test');
    expect(store.state.healthCheck).toBe('test');
  });

  it('updates "apiCheckResponse" value when "setApiCheckResponse" is commited', () => {
    expect(store.state.healthCheck).toBe(null);
    store.commit('setHealthCheck', 'test');
    expect(store.state.healthCheck).toBe('test');
  });
});
