import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import apiAccessStore from '@/store/modules/apiAccess';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('apiAccess getters', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(apiAccessStore));
  });

  it('step should return 1 on default', () => {
    expect(store.getters.step).toEqual(1);
  });

  it('step should return oidc endpoint on default', () => {
    expect(store.getters.tokenEndpoint).toEqual('https://oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token');
  });

  it('step should return test oidc endpoint for test', () => {
    store.state.environment = 'test';
    expect(store.getters.tokenEndpoint).toEqual('https://test.oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token');
  });

  it('step should return dev oidc endpoint for test', () => {
    store.state.environment = 'dev';
    expect(store.getters.tokenEndpoint).toEqual('https://dev.oidc.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token');
  });
});
