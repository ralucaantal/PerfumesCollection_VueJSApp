export default {
  state() {
    return {
      brandId: null,
      brandName: null,
      perfumes: [],
    };
  },
  mutations: {
    setParams(state, { brandId, brandName }) {
      state.brandId = brandId;
      state.brandName = brandName;
    },
    setPerfumes(state, perfumes) {
      state.perfumes = perfumes;
    },
  },
  actions: {
    transferData({ commit }, { brandId, brandName }) {
      commit("setParams", { brandId, brandName });
    },
  },
  getters: {
    getParams: (state) => ({
      brandId: state.brandId,
      brandName: state.brandName,
    }),
  },
};
