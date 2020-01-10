
import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import configFormStore from '@/store/modules/configForm';

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

  it('updates "commonServiceType" values when "setCommonServiceType" is commited', () => {
    expect(store.state.commonServiceType).toBe(undefined);
    store.commit('setCommonServiceType', 'keycloak');
    expect(store.state.userAppCfg.commonServiceType).toBe('keycloak');
    expect(store.getters.commonServiceType).toBe('keycloak');
  });

  it('updates "existingWebAdeConfig" values when "setExistingWebAdeConfig" is commited', () => {
    expect(store.state.existingWebAdeConfig).toBe('');
    store.commit('setExistingWebAdeConfig', { test: '123' });
    expect(store.getters.existingWebAdeConfig).toBeTruthy();
  });

  it('updates "userAppCfg" values when "updateUserAppCfg" is commited', () => {
    store.commit('updateUserAppCfg', { test: 123 });
    expect(store.state.userAppCfg).toStrictEqual({
      applicationAcronym: '',
      applicationName: '',
      applicationDescription: '',
      commonServiceType: '',
      commonServices: [],
      deploymentMethod: '',
      clientEnvironment: '',
      test: 123
    });
  });

  it('returns "false" from "usingWebadeConfig" when "commonServiceType" is KC', () => {
    store.commit('setCommonServiceType', 'keycloak');
    expect(store.getters.usingWebadeConfig).toBe(false);
  });

  it('returns "true" from "usingWebadeConfig" when "commonServiceType" is WEBADE', () => {
    store.commit('setCommonServiceType', 'webade');
    expect(store.getters.usingWebadeConfig).toBe(true);
  });
});

describe('configForm.js - WebADE configs', () => {
  let store;

  const configBlank = require('../fixtures/webAdeConfigs/configBlank.json');
  const configWithCmsg = require('../fixtures/webAdeConfigs/configWithCmsg.json');
  const configWithNoServices = require('../fixtures/webAdeConfigs/configWithNoServices.json');
  const configWithNrosDMS = require('../fixtures/webAdeConfigs/configWithNrosDMS.json');

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(configFormStore));
  });

  it('returns the expected WebADE App config based on the user entered details - totally blank', () => {
    const config = store.getters.appConfigAsString;
    expect(config).toBeTruthy();
    expect(config).toEqual(JSON.stringify(configBlank, null, 2));
  });

  it('returns the expected WebADE App config based on the user entered details - no services', () => {
    store.state.userAppCfg = {
      applicationAcronym: 'WORG',
      applicationName: 'Document Generation',
      applicationDescription: 'A sample application description test',
      commonServices: []
    }

    const config = store.getters.appConfigAsString;
    expect(config).toBeTruthy();
    expect(config).toEqual(JSON.stringify(configWithNoServices, null, 2));
  });

  it('returns the expected WebADE App config based on the user entered details - cmsg', () => {
    store.state.userAppCfg = {
      applicationAcronym: 'WORG',
      applicationName: 'Document Generation',
      applicationDescription: 'A sample application description test',
      commonServices: ['cmsg']
    }

    const config = store.getters.appConfigAsString;
    expect(config).toBeTruthy();
    expect(config).toEqual(JSON.stringify(configWithCmsg, null, 2));
  });

  it('returns the expected WebADE App config based on the user entered details - nros-dms', () => {
    store.state.userAppCfg = {
      applicationAcronym: 'MDS',
      applicationName: 'Mines Digital Services',
      applicationDescription: 'The technologies that support mine oversight',
      commonServices: ['nros-dms']
    }

    const config = store.getters.appConfigAsString;
    expect(config).toBeTruthy();
    expect(config).toEqual(JSON.stringify(configWithNrosDMS, null, 2));
  });

  it('returns the expected WebADE App config with a placeholder secret for the manual deployment mode', () => {
    store.state.userAppCfg = {
      applicationAcronym: 'WORG',
      applicationName: 'Document Generation',
      applicationDescription: 'A sample application description test',
      deploymentMethod: 'deploymentManual'
    }

    const configWithNoServicesCopy = JSON.parse(JSON.stringify(configWithNoServices));
    configWithNoServicesCopy.serviceClients[0].secret = '${WORG_SERVICE_CLIENT.password}';

    const config = store.getters.appConfigAsString;
    expect(config).toBeTruthy();
    expect(config).toEqual(JSON.stringify(configWithNoServicesCopy, null, 2));
  });

});
