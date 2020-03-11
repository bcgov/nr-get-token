import UserService from '@/services/userService';

export default {
  namespaced: true,
  state: {
    acronyms: []
  },
  getters: {
    acronyms: state => state.acronyms
  },
  mutations: {
    setAcronyms: (state, acronyms = []) => {
      if (Array.isArray(acronyms)) {
        state.acronyms = acronyms;
      }
    }
  },
  actions: {
    /**
    * @function getUserAcronyms
    * Fetch the acronyms the current user has access to from the DB
    * @param {object} context The store context
    */
    async getUserAcronyms(context) {
      const response = await UserService.getUserAcronyms();
      if(response) {
        context.commit('setAcronyms', response);
      }
    }
  }
};
