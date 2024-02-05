<template>
  <div class="home">
    <img alt="Welcome" src="../assets/home.png" class="small-image" />
    <div v-if="isLoggedIn">
      <h1>Welcome, {{ getUsername() }}!</h1>
    </div>
    <div v-else>
      <h1>Welcome!</h1>
    </div>
    <div class="quotation-container">
      <h3>
        `Perfumery is a symphony, it has a beginning, middle and an end.` –
        Isabelle Ramsay-Brackstone
      </h3>
    </div>
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

          //console.log("Tokenul decodificat este: ", decodedToken);

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

<style>
body {
  margin: 0;
}

.small-image {
  width: 300px;
  height: auto;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 2rem);
}

.quotation-container {
  background-color: #eeecec;
  border: 2px solid #c4bbf0;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
}

.quotation-container h3 {
  margin: 0;
}
</style>
