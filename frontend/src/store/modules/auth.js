import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';

export default {
  namespaced: true,
  state: {
    acronyms: [],
    hasReadAllWebade: false,
    isAuthenticated: localStorage.getItem('jwtToken') !== null
  },
  getters: {
    acronyms: state => state.acronyms,
    hasReadAllWebade: state => state.hasReadAllWebade,
    isAuthenticated: state => state.isAuthenticated,
    hasAcronyms: state => state.acronyms && state.acronyms.length,
    jwtToken: () => localStorage.getItem('jwtToken'),
    refreshToken: () => localStorage.getItem('refreshToken')
  },
  mutations: {
    setJwtToken: (state, token = null) => {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.realm_access.roles;

        // TODO: this will require re-conceptualizing as acronyms will come from the DB, not the access roles in the future.
        if (typeof roles === 'object' && roles instanceof Array) {
          state.acronyms = roles.filter(role => !role.match(/offline_access|uma_authorization|WEBADE_CFG_READ|WEBADE_CFG_READ_ALL/));
          state.hasReadAllWebade = roles.some(role => role === 'WEBADE_CFG_READ_ALL');
        } else {
          state.acronyms = [];
        }

        state.isAuthenticated = true;
        localStorage.setItem('jwtToken', token);
      } else {
        state.acronyms = [];
        state.isAuthenticated = false;
        localStorage.removeItem('jwtToken');
      }
    },
    setRefreshToken: (_state, token = null) => {
      if (token) {
        localStorage.setItem('refreshToken', token);
      } else {
        localStorage.removeItem('refreshToken');
      }
    }
  },
  actions: {
    async getJwtToken(context) {
      try {
        if (context.getters.isAuthenticated && !!context.getters.refreshToken) {
          const now = Date.now().valueOf() / 1000;
          const jwtPayload = context.getters.jwtToken.split('.')[1];
          const payload = JSON.parse(window.atob(jwtPayload));

          if (payload.exp > now) {
            const response = await AuthService.refreshAuthToken(context.getters.refreshToken);

            if (response.jwt) {
              context.commit('setJwtToken', response.jwt);
            }
            if (response.refreshToken) {
              context.commit('setRefreshToken', response.refreshToken);
            }
            ApiService.setAuthHeader(response.jwt);
          }
        } else {
          const response = await AuthService.getAuthToken();

          if (response.jwt) {
            context.commit('setJwtToken', response.jwt);
          }
          if (response.refreshToken) {
            context.commit('setRefreshToken', response.refreshToken);
          }
          ApiService.setAuthHeader(response.jwt);
        }
      } catch (e) {
        // Remove tokens from localStorage and update state
        context.commit('setJwtToken');
        context.commit('setRefreshToken');
      }
    }
  }
};
