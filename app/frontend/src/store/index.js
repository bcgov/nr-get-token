import Vue from 'vue';
import Vuex from 'vuex';

// Todo: dynamic load, just scaffolding in here for skeleton
import apiAccess from '@/store/modules/apiAccess.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { apiAccess }
});
