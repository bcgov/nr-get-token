import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';

/**
 *  @function isExpired
 *  Checks if the JWT `token` is expired
 *  @param {string} token JWT Token String
 *  @returns {boolean} True if expired or doesn't exist, false otherwise
 */
function isExpired(token) {
  if (token) {
    const now = Date.now().valueOf() / 1000;
    const jwtPayload = token.split('.')[1];
    const payload = JSON.parse(window.atob(jwtPayload));

    return payload.exp < now;
  }
  return true;
}

export default {
  namespaced: true,
  state: {
    acronyms: [],
    hasReadAllWebade: false,
    hasWebadeNrosDmsPermission: false,
    hasWebadePermission: false,
    isAuthenticated: localStorage.getItem('refreshToken'),
    userInfo: {
      emailAddress: '',
      idir: '',
      name: ''
    }
  },
  getters: {
    acronyms: state => state.acronyms,
    hasAcronyms: state => state.acronyms && state.acronyms.length,
    hasReadAllWebade: state => state.hasReadAllWebade,
    hasWebadeNrosDmsPermission: state => state.hasWebadeNrosDmsPermission,
    hasWebadePermission: state => state.hasWebadePermission,
    isAuthenticated: state => state.isAuthenticated,
    jwtToken: () => sessionStorage.getItem('jwtToken'),
    refreshToken: () => localStorage.getItem('refreshToken'),
    userInfo: state => state.userInfo
  },
  mutations: {
    setAcronyms: (state, acronyms = []) => {
      if (Array.isArray(acronyms)) {
        state.acronyms = acronyms;
      }
    },
    setJwtToken: (state, token = null) => {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.realm_access.roles;

        if (typeof roles === 'object' && roles instanceof Array) {
          state.hasReadAllWebade = roles.some(role => role === 'WEBADE_CFG_READ_ALL');
          state.hasWebadePermission = roles.some(role => role === 'WEBADE_PERMISSION');
          state.hasWebadeNrosDmsPermission = roles.some(role => role === 'WEBADE_PERMISSION_NROS_DMS');
        }

        state.userInfo.emailAddress = payload.email;
        state.userInfo.idir = payload.preferred_username;
        state.userInfo.name = payload.name;

        sessionStorage.setItem('jwtToken', token);
      } else {
        state.userInfo.emailAddress = '';
        state.userInfo.idir = '';
        state.userInfo.name = '';

        sessionStorage.removeItem('jwtToken');
      }
    },
    setRefreshToken: (state, token = null) => {
      if (token) {
        state.isAuthenticated = true;
        localStorage.setItem('refreshToken', token);
      } else {
        state.isAuthenticated = false;
        localStorage.removeItem('refreshToken');
      }
    }
  },
  actions: {
    async getUser(context) {
      try {
        if (context.getters.refreshToken && isExpired(context.getters.jwtToken)) {
          const response = await AuthService.refreshAuthToken(context.getters.refreshToken);

          if (response.jwt) {
            context.commit('setJwtToken', response.jwt);
          }
          if (response.refreshToken) {
            context.commit('setRefreshToken', response.refreshToken);
          }
        }
        const response = await AuthService.getAuthToken();

        if (response.acronyms) {
          context.commit('setAcronyms', response.acronyms);
        }
        if (response.jwt) {
          context.commit('setJwtToken', response.jwt);
        }
        if (response.refreshToken) {
          context.commit('setRefreshToken', response.refreshToken);
        }
        ApiService.setAuthHeader(response.jwt);
      } catch (e) {
        // Remove tokens from browser storage and update state
        context.commit('setAcronyms');
        context.commit('setJwtToken');
        context.commit('setRefreshToken');
      }
    }
  }
};
