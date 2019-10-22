import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    errorMessage: '',
    searching: false,
    webAdeConfig: '',
    webAdeDependencies: null
  },
  getters: {
    errorMessage: state => state.errorMessage,
    searching: state => state.searching,
    webAdeConfig: state => state.webAdeConfig ? JSON.stringify(state.webAdeConfig, null, 2) : '',
    webAdeDependencies: state => state.webAdeDependencies
  },
  mutations: {
    setErrorMessage: (state, errorMessage) => {
      state.errorMessage = errorMessage;
    },
    setSearching: (state, searching) => {
      state.searching = searching;
    },
    setWebAdeConfig: (state, cfg) => {
      state.webAdeConfig = cfg;
    },
    setWebAdeDependencies: (state, dep) => {
      state.webAdeDependencies = dep;
    }
  },
  actions: {
    async getWebAdeConfig(context, payload) {
      try {
        context.commit('setErrorMessage', '');
        context.commit('setWebAdeConfig', '');
        context.commit('setWebAdeDependencies', null);
        const response = await ApiService.getWebAdeConfig(payload.webAdeEnv, payload.acronym);
        if (response) {
          context.commit('setWebAdeConfig', response);
        } else {
          context.commit('setErrorMessage', `Could not find a WebADE configuration for the acronym ${payload.acronym} in ${payload.webAdeEnv}`);
        }
      } catch (error) {
        context.commit('setErrorMessage', `An error occurred getting the WebADE configuration for ${payload.acronym} in ${payload.webAdeEnv}`);
      }
    },
    async getWebAdeDependencies(context, payload) {
      try {
        context.commit('setWebAdeDependencies', null);
        const response = await ApiService.getWebAdeDependencies(payload.webAdeEnv, payload.acronym);
        if (response) {
          context.commit('setWebAdeDependencies', response);
        } else {
          context.commit('setErrorMessage', `Error occurred trying to resolve dependencies on ${payload.acronym} in ${payload.webAdeEnv}`);
        }
      } catch (error) {
        context.commit('setErrorMessage', `Error occurred trying to resolve dependencies on ${payload.acronym} in ${payload.webAdeEnv}`);
      }
    }
  }
};
