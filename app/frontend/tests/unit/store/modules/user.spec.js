import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import userStore from '@/store/modules/user';
import { cloneDeep } from 'lodash';


describe('user.js', () => {
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    store = new Vuex.Store(cloneDeep(userStore));
  });

  it('updates "acronyms" value when "setAcronyms" is commited', () => {
    expect(store.state.acronyms).toStrictEqual([]);
    store.commit('setAcronyms', ['a', 'b', 'c']);
    expect(store.getters.acronyms).toStrictEqual(['a', 'b', 'c']);
  });

  it('resolves in an empty "acronyms" value when "setAcronyms" is commited with a non-array', () => {
    store.commit('setAcronyms', 'wrong');
    expect(store.getters.acronyms).toStrictEqual([]);
  });
});
