import { ApiService } from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    isAuthenticated: !!localStorage.getItem('jwtToken')
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    jwtToken: () => localStorage.getItem('jwtToken'),
    refreshToken: () => localStorage.getItem('refreshToken'),
  },
  mutations: {
    setJwtToken: (state, token) => {
      if (token) {
        state.isAuthenticated = true;
        localStorage.setItem('jwtToken', token);
      } else {
        state.isAuthenticated = false;
        localStorage.removeItem('jwtToken');
      }
    },
    setRefreshToken: (_state, token) => {
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
        if (context.getters.isAuthenticated) {
          const now = Date.now().valueOf() / 1000;
          const jwtPayload = localStorage.getItem('jwtToken').split('.')[1];
          const payload = JSON.parse(window.atob(jwtPayload));

          if (payload.exp > now) {
            const response = await ApiService.getAuthToken();

            if (response.jwt) {
              context.commit('setJwtToken', response.jwt);
            }
            // TODO: Add refresh token support
            if (response.refreshToken) {
              context.commit('setRefreshToken', response.refreshToken);
            }
          }
        } else {
          const response = await ApiService.getAuthToken();

          if (response.jwt) {
            context.commit('setJwtToken', response.jwt);
          }
          // TODO: Add refresh token support
          if (response.refreshToken) {
            context.commit('setRefreshToken', response.refreshToken);
          }
        }
      } catch (e) {
        console.log('ERROR, caught error while getting JWT token'); // eslint-disable-line no-console
        console.log(e); // eslint-disable-line no-console
        throw e;
      }
    }
  }
};
