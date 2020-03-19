import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import userStore from '@/store/modules/user';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('user mutations', () => {
  describe('setAcronyms', () => {
    let store;

    beforeEach(() => {
      store = new Vuex.Store(cloneDeep(userStore));
    });

    it('setAcronyms updates acronym state when commited with an array', () => {
      expect(store.state.acronyms).toStrictEqual([]);
      store.commit('setAcronyms', ['a', 'b', 'c']);
      expect(store.getters.acronyms).toStrictEqual(['a', 'b', 'c']);
    });

    it('setAcronyms updates acronym state to empty array when commited with a non-array', () => {
      store.commit('setAcronyms', 'wrong');
      expect(store.getters.acronyms).toStrictEqual([]);
    });
  });
});
