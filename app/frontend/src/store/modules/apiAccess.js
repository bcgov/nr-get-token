// Lots more to come here, not just the UI step...
export default {
  namespaced: true,
  state: {
    step: 1
  },
  getters: {
    step: state => state.step
  },
  mutations: {
    setStep: (state, step) => {
      state.step = step;
    }
  },
  actions: {}
};
