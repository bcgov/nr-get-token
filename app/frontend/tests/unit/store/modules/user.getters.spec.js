import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import userStore from '@/store/modules/user';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('auth getters', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(userStore));
  });

  it('moduleLoaded should return a boolean', () => {
    expect(store.getters.moduleLoaded).toBeFalsy();
  });
});
