import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import configFormStore from '@/store/modules/configForm';
import { cloneDeep } from 'lodash';

describe('configForm.js', () => {
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(configFormStore));
  });

  it('updates "configSubmission" values when "setConfigSubmissionInProgress" is commited', () => {
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
    store.commit('setConfigSubmissionInProgress');
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(true);
  });

  it('updates "configSubmission" values when "setConfigSubmissionSuccess" is commited', () => {
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
    store.commit('setConfigSubmissionSuccess', 'success');
    expect(store.state.configSubmissionSuccess).toBe('success');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
  });

  it('updates "configSubmission" values when "setConfigSubmissionError" is commited', () => {
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
    store.commit('setConfigSubmissionError', 'error');
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('error');
    expect(store.state.configSubmissionInProgress).toBe(false);
  });

  it('updates "configSubmission" values when "clearConfigSubmissionMsgs" is commited', () => {
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
    store.commit('clearConfigSubmissionMsgs');
    expect(store.state.configSubmissionSuccess).toBe('');
    expect(store.getters.configSubmissionSuccess).toBe('');
    expect(store.state.configSubmissionError).toBe('');
    expect(store.getters.configSubmissionError).toBe('');
    expect(store.state.configSubmissionInProgress).toBe(false);
    expect(store.getters.configSubmissionInProgress).toBe(false);
  });

  it('updates "configFormSubmissionResult" values when "setConfigFormSubmissionResult" is commited', () => {
    expect(store.state.configFormSubmissionResult).toBe(null);
    store.commit('setConfigFormSubmissionResult', 'test');
    expect(store.state.configFormSubmissionResult).toBe('test');
    expect(store.getters.configFormSubmissionResult).toBe('test');
  });

  it('updates "ephemeralPasswordRSAKey" values when "setEphemeralPasswordRSAKey" is commited', () => {
    expect(store.state.ephemeralPasswordRSAKey).toBe(null);
    store.commit('setEphemeralPasswordRSAKey', 'test');
    expect(store.state.ephemeralPasswordRSAKey).toBe('test');
    expect(store.getters.ephemeralPasswordRSAKey).toBe('test');
  });
});
