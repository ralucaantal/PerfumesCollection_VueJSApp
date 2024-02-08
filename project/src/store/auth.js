// auth.js
import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      isLoggedIn: false,
      brandId: null,
      brandName: null,
    };
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setParams(state, { brandId, brandName }) {
      state.brandId = brandId;
      state.brandName = brandName;
    },
  },
  actions: {
    login({ commit }) {
      console.log("Începe acțiunea de login"); 
      return new Promise((resolve) => {
        console.log(
          "Autentificare reușită. Setează starea isLoggedIn pe true."
        );
        commit("setLoggedIn", true);

        
        console.log("Stare isLoggedIn:", this.state.isLoggedIn);

        resolve(); 
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {

        console.log("Delogare. Setează starea isLoggedIn pe false.");
        commit("setLoggedIn", false);

        
        console.log("Stare isLoggedIn:", this.state.isLoggedIn);

        resolve();
      });
    },
    transferData({ commit }, { brandId, brandName }) {
      console.log("Datele din auth.js: " + brandId + " " + brandName)
      commit("setParams", { brandId, brandName });
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    getParams: (state) => ({
      brandId: state.brandId,
      brandName: state.brandName,
    }),
  },
});
