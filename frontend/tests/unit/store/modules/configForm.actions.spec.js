
import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import ApiService from '@/common/apiService';
import configFormStore from '@/store/modules/configForm';

describe('configForm.js - getAcronymDetails action', () => {
  let store;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(configFormStore));
  });

  const spy = jest.spyOn(ApiService, 'getAcronymDetails');
  jest.mock('../../../../src/common/apiService');

  afterEach(() => {
    spy.mockClear();
  });

  it('returns acronym details from the api service call', async () => {
    const acronymDetails = { test: 123 };
    ApiService.getAcronymDetails.mockResolvedValue(acronymDetails);
    await store.dispatch('getAcronymDetails', 'WORG');

    expect(store.getters.selectedAcronymDetails).toEqual(acronymDetails);
    expect(store.getters.configSubmissionError).toEqual('');
  });

  it('sets the config form error if the acronym api service call returns nothing', async () => {
    ApiService.getAcronymDetails.mockResolvedValue(null);
    await store.dispatch('getAcronymDetails', 'WORG');

    expect(store.getters.selectedAcronymDetails).toBeNull();
    expect(store.getters.configSubmissionError).toEqual('An error occurred fetching application details for WORG');
  });

  it('sets the config form error if the acronym api service call throws', async () => {
    ApiService.getAcronymDetails.mockImplementation(() => {
      throw new Error();
    });
    await store.dispatch('getAcronymDetails', 'WORG');

    expect(store.getters.selectedAcronymDetails).toBeNull();
    expect(store.getters.configSubmissionError).toEqual('An error occurred fetching application details for WORG');
  });

  it('sets selected acronym to null if null is passed in', async () => {
    await store.dispatch('getAcronymDetails', null);

    expect(store.getters.selectedAcronymDetails).toBeNull();
    expect(store.getters.configSubmissionError).toEqual('');
  });
});

describe('configForm.js - getWebAdeConfig action', () => {
  let store;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(configFormStore));
  });

  const spy = jest.spyOn(ApiService, 'getWebAdeConfig');
  jest.mock('../../../../src/common/apiService');

  afterEach(() => {
    spy.mockClear();
  });

  it('returns webade config details from the api service call', async () => {
    const webadeCfg = { test: 123, links: 'abc' };
    ApiService.getWebAdeConfig.mockResolvedValue(webadeCfg);
    await store.dispatch('getWebAdeConfig', { webAdeEnv: 'INT', acronym: 'ABC' });

    expect(store.getters.existingWebAdeConfig).toEqual(JSON.stringify({ test: 123 }, null, 2));
  });

  it('returns an error message if the api call fails', async () => {
    ApiService.getWebAdeConfig.mockImplementation(() => {
      throw new Error();
    });
    await store.dispatch('getWebAdeConfig', { webAdeEnv: 'INT', acronym: 'ABC' });

    expect(store.getters.existingWebAdeConfig).toEqual('"An error occurred getting the existing WebADE configuration for ABC in INT"');
  });
});


describe('configForm.js - submitConfigForm action', () => {
  let store;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(configFormStore));
  });

  const spy = jest.spyOn(ApiService, 'postConfigForm');
  jest.mock('../../../../src/common/apiService');

  afterEach(() => {
    spy.mockClear();
  });

  it('sucessfully sets the returned client/pw', async () => {
    ApiService.postConfigForm.mockResolvedValue({ generatedServiceClient: 'WORG_SERVICE_CLIENT', generatedPassword: 'abcd' });
    await store.dispatch('submitConfigForm');

    expect(store.getters.configSubmissionError).toEqual('');
    expect(store.getters.configSubmissionSuccess).toBeTruthy();
  });

  it('returns an error message if the api call has no response', async () => {
    ApiService.postConfigForm.mockResolvedValue(undefined);
    await store.dispatch('submitConfigForm');

    expect(store.getters.configSubmissionError).toEqual('An error occurred while attempting to create a service client in Keycloak.');
  });

  it('returns an error message if the api call has no response password', async () => {
    ApiService.postConfigForm.mockResolvedValue({ generatedPassword: '' });
    await store.dispatch('submitConfigForm');

    expect(store.getters.configSubmissionError).toEqual('An error occurred while attempting to create a service client in Keycloak.');
  });

  it('returns an error message if the api call fails', async () => {
    ApiService.postConfigForm.mockImplementation(() => {
      throw new Error();
    });
    await store.dispatch('submitConfigForm');

    expect(store.getters.ephemeralPasswordRSAKey).toBeTruthy();
    expect(store.getters.configSubmissionError).toEqual('An error occurred while attempting to create a service client in Keycloak.');
  });
});
