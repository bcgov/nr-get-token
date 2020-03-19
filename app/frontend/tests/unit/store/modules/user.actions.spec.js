import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import userService from '@/services/userService';
import userStore from '@/store/modules/user';

const localVue = createLocalVue();
localVue.use(Vuex);

const zeroUuid = '00000000-0000-0000-0000-000000000000';

describe('user actions', () => {
  describe('getUserAcronyms', () => {
    const spy = jest.spyOn(userService, 'getUserAcronyms');
    let store;

    beforeEach(() => {
      spy.mockClear();
      store = new Vuex.Store(cloneDeep(userStore));
    });

    it('returns acronym details from the api service call', async () => {
      const mockAcronyms = [
        { acronym: 'test', owner: false },
        { acronym: 'other', owner: false }
      ];
      userService.getUserAcronyms.mockResolvedValue({ data: mockAcronyms });
      store.registerModule('auth', {
        namespaced: true,
        getters: {
          authenticated: () => true,
          subject: () => zeroUuid
        }
      });

      await store.dispatch('getUserAcronyms');

      expect(store.getters.acronyms).toEqual(mockAcronyms);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('handles an empty array', async () => {
      userService.getUserAcronyms.mockResolvedValue({ data: [] });
      store.registerModule('auth', {
        namespaced: true,
        getters: {
          authenticated: () => true,
          subject: () => zeroUuid
        }
      });

      await store.dispatch('getUserAcronyms');

      expect(store.getters.acronyms).toEqual([]);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('handles a blank return', async () => {
      const errMsg = 'test error message';
      userService.getUserAcronyms.mockRejectedValue(errMsg);
      store.registerModule('auth', {
        namespaced: true,
        getters: {
          authenticated: () => true,
          subject: () => zeroUuid
        }
      });

      await store.dispatch('getUserAcronyms');

      expect(store.getters.acronyms).toEqual([]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
