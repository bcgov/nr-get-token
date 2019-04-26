import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: "",
    userAppCfg: {
      applicationAcronym: "",
      applicationName: "",
      applicationDescription: "",
    }
  }, getters: {
    token: state => state.token,
    appConfigAsString: state => {
      // these are the hardcoded WebADE cfg values users do not enter
      const defaultAppCfg = {
        "@type": "http://webade.gov.bc.ca/applicationConfiguration",
        applicationAcronym: "",
        custodianNumber: 0,
        applicationName: "",
        applicationDescription: "",
        applicationObjectPrefix: null,
        enabledInd: true,
        distributeTypeCd: null,
        managementEnabledInd: false,
        applicationVersion: null,
        reportedWebadeVersion: null,
        actions: [],
        roles: [],
        wdePreferences: [],
        applicationPreferences: [],
        globalPreferences: [],
        defaultUserPreferences: [],
        profiles: [],
        serviceClients: [],
        groupAuthorizations: []
      };

      const appCfgVals = {
        ...defaultAppCfg,
        ...state.userAppCfg,
      };
      return JSON.stringify(appCfgVals, null, 2);
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    updateUserAppCfg: function (state, userAppCfg) {
      Object.assign(state.userAppCfg, userAppCfg);
    }
  },
  actions: {

  }
})
