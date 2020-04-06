import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import apiAccess from '@/store/modules/apiAccess';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('apiAccess mutations', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(apiAccess));
  });

  it('setStep updates step state when commited', () => {
    expect(store.state.step).toEqual(1);
    store.commit('setStep', 4);
    expect(store.getters.step).toEqual(4);
  });
});
