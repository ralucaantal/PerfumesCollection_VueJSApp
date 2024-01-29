<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <div v-if="isLoggedIn">
      <h1>Welcome, {{ getUsername() }}!</h1>
    </div>
    <div v-else>
      <h1>Welcome!</h1>
      <!-- Aici poți adăuga altceva pentru utilizatorii neautentificați -->
    </div>
    <br />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import { useStore } from "vuex";
import { ref, watch } from "vue";

export default {
  setup() {
    //const token = localStorage.getItem("token");
    //const token = () => localStorage.getItem("token");
    //const isLoggedIn = token !== null;

    const store = useStore();
    const isLoggedIn = ref(store.state.isLoggedIn);
    const getToken = () => localStorage.getItem("token");

    watch(
      () => store.state.isLoggedIn,
      (newValue) => {
        isLoggedIn.value = newValue;
      }
    );

    return {
      isLoggedIn,
      getToken,
    };
  },

  methods: {
    getUsername() {
      const tokenValue = this.getToken();
      // if (this.token) {
      if (tokenValue) {
        //console.log("Tokenul este: ", this.token);

        try {
          //console.log("sunt aici" + this.token);
          //const decodedToken = jwt_decode(this.token);
          const decodedToken = jwt_decode(tokenValue);

          console.log("Tokenul decodificat este: ", decodedToken);

          return decodedToken && decodedToken.name
            ? decodedToken.name
            : "Utilizator";
        } catch (error) {
          console.error("Eroare la decodificarea tokenului:", error);
          return "Utilizator";
        }
      } else {
        return "Utilizator";
      }
    },
  },
};
</script>
