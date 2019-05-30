import Vue from 'vue';
import Vuex from 'vuex';
import authModule from '@/store/modules/authModule.js';
import configFormModule from '@/store/modules/configFormModule.js';
import healthCheckModule from '@/store/modules/healthCheckModule.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { authModule, configFormModule, healthCheckModule }
});
