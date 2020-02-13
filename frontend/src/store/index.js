import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth.js';
import configForm from '@/store/modules/configForm.js';
import checks from '@/store/modules/checks.js';
import webadeVisualizer from '@/store/modules/webadeVisualizer.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { auth, configForm, checks, webadeVisualizer },
  state: {
    devMode: false
  },
  getters: {
    devMode: state => state.devMode
  },
  mutations: {
    setDevMode: state => {
      state.devMode = true;
    }
  }
});
