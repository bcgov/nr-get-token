import { ApiService } from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    healthCheck: null,
    apiCheckResponse: '',
  },
  getters: {
  },
  mutations: {
    setHealthCheck: (state, health) => {
      state.healthCheck = health;
    },
    setApiCheckResponse: (state, val) => {
      state.apiCheckResponse = val;
    }
  },
  actions: {
    async getHealthCheckStatus(context) {
      context.commit('setHealthCheck', null);
      try {
        const response = await ApiService.getHealthCheck(context.rootGetters.auth.jwtToken);
        context.commit('setHealthCheck', response);
      } catch (e) {
        context.commit('setHealthCheck', 'error');
      }
    },
    async getApiCheck(context, route) {
      context.commit('setApiCheckResponse', '');
      try {
        const response = await ApiService.getApiCheck(context.rootGetters.auth.jwtToken, route);
        context.commit('setApiCheckResponse', response);
      } catch (e) {
        context.commit('setApiCheckResponse', e);
      }
    }
  }
};
