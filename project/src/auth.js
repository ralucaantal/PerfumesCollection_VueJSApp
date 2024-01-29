// auth.js
import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      isLoggedIn: false,
    };
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
  },
  actions: {
    login({ commit }) {
      console.log("Începe acțiunea de login"); // Adăugați această linie
      return new Promise((resolve) => {


        console.log(
          "Autentificare reușită. Setează starea isLoggedIn pe true."
        );
        commit("setLoggedIn", true);

        // Verificare starea isLoggedIn după actualizare
        console.log("Stare isLoggedIn:", this.state.isLoggedIn);

        resolve(); // Resolve promisiunea pentru a semnala finalizarea acțiunii
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        // Logica de delogare aici
        // ...

        console.log("Delogare. Setează starea isLoggedIn pe false.");
        commit("setLoggedIn", false);

        // Verificare starea isLoggedIn după actualizare
        console.log("Stare isLoggedIn:", this.state.isLoggedIn);

        resolve(); // Resolve promisiunea pentru a semnala finalizarea acțiunii
      });
    },
  },
});
