import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';

import userService from '@/services/userService';
import userStore from '@/store/modules/user';

const zeroUuid = '00000000-0000-0000-0000-000000000000';

describe('user.js - getUserAcronyms action', () => {
  const spy = jest.spyOn(userService, 'getUserAcronyms');
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    Object.defineProperty(Vue.prototype, '$keycloak', {
      configurable: true, // Needed to allow deletions later
      get() {
        return {
          authenticated: true,
          ready: true,
          subject: zeroUuid
        };
      }
    });

    store = new Vuex.Store(cloneDeep(userStore));
    spy.mockClear();
  });

  afterEach(() => {
    if (Vue.prototype.$keycloak) {
      delete Vue.prototype.$keycloak;
    }
  });

  it('returns acronym details from the api service call', async () => {
    const mockAcronyms = [
      { acronym: 'test', owner: false },
      { acronym: 'other', owner: false }
    ];
    userService.getUserAcronyms.mockResolvedValue({ data: mockAcronyms });

    await store.dispatch('getUserAcronyms');

    expect(store.getters.acronyms).toEqual(mockAcronyms);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('handles an empty array', async () => {
    userService.getUserAcronyms.mockResolvedValue({ data: [] });

    await store.dispatch('getUserAcronyms');

    expect(store.getters.acronyms).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('handles a blank return', async () => {
    const errMsg = 'test error message';
    userService.getUserAcronyms.mockRejectedValue(errMsg);

    await store.dispatch('getUserAcronyms');

    expect(store.getters.acronyms).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
