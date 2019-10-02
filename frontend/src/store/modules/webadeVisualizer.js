import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    searching: false,
    resultFound: false,
    webAdeConfig: ''
  },
  getters: {
    searching: state => state.searching,
    resultFound: state => state.resultFound,
    webAdeConfig: state => JSON.stringify(state.webAdeConfig, null, 2)
  },
  mutations: {
    setSearching: (state, searching) => {
      state.searching = searching;
    },
    setResultFound: (state, resultFound) => {
      state.resultFound = resultFound;
    },
    setWebAdeConfig: (state, cfg) => {
      state.webAdeConfig = cfg;
    }
  },
  actions: {
    async getWebAdeConfig(context, payload) {
      try {
        const response = await ApiService.getWebAdeConfig(payload.webAdeEnv, payload.acronym);
        context.commit('setResultFound', true);
        context.commit('setWebAdeConfig', response);
      } catch (error) {
        context.commit('setWebAdeConfig', `An error occurred getting the WebADE configuration for ${payload.acronym} in ${payload.webAdeEnv}`);
      }
    }
  }
};
