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
});
