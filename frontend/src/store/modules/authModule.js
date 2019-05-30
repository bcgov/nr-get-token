import { ApiService } from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    jwtToken: localStorage.getItem('jwt') || '',
    refreshToken: localStorage.getItem('refresh') || ''
  },
  getters: {
    isAuthenticated: state => !!state.jwtToken,
    jwtToken: state => state.jwtToken,
    refreshToken: state => state.refreshToken,
  },
  mutations: {
    setJwtToken: (state, jwt) => {
      state.jwtToken = jwt;
    },
    setRefreshToken: (state, refresh) => {
      state.refreshToken = refresh;
    }
  },
  actions: {
    async getJwtToken(context) {
      try {
        if (context.getters.isAuthenticated) {
          const now = Date.now().valueOf() / 1000;
          const jwtPayload = context.state.jwtToken.split('.')[1];
          const payload = JSON.parse(window.atob(jwtPayload));

          if (payload.exp > now) {
            const response = await ApiService.getAuthToken();

            if (response.jwt) {
              context.commit('setJwtToken', response.jwt);
              localStorage.setItem('jwtToken', response.jwt);
            }
            // TODO: Add refresh token support
            if (response.refreshToken) {
              context.commit('setRefreshToken', response.refreshToken);
              localStorage.setItem('refreshToken', response.refreshToken);
            }
          }
        } else {
          const response = await ApiService.getAuthToken();

          if (response.jwt) {
            context.commit('setJwtToken', response.jwt);
            localStorage.setItem('jwtToken', response.jwt);
          }
          // TODO: Add refresh token support
          if (response.refreshToken) {
            context.commit('setRefreshToken', response.refreshToken);
            localStorage.setItem('refreshToken', response.refreshToken);
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
