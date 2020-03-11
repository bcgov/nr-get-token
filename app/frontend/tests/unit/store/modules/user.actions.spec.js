import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import userService from '@/services/userService';
import userStore from '@/store/modules/user';

describe('user.js - getUserAcronyms action', () => {
  let store;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(userStore));
  });

  const spy = jest.spyOn(userService, 'getUserAcronyms');
  jest.mock('../../../../src/services/userService');

  afterEach(() => {
    spy.mockClear();
  });

  it('returns acronym details from the api service call', async () => {
    const mockAcronyms = [{ acronym: 'test', owner: false }, { acronym: 'other', owner: false }];
    userService.getUserAcronyms.mockResolvedValue(mockAcronyms);
    await store.dispatch('getUserAcronyms');

    expect(store.getters.acronyms).toEqual(mockAcronyms);
  });

  it('handles a blank return', async () => {
    userService.getUserAcronyms.mockResolvedValue(undefined);
    await store.dispatch('getUserAcronyms');

    expect(store.getters.acronyms).toEqual([]);
  });

});
