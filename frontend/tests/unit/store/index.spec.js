import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import indexStore from '@/store/index';

test('index loads and exists', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  expect(indexStore).toBeTruthy();
});
