<template>
  <nav>
    <router-link to="/">Home | </router-link> 
    <router-link v-if="!isLoggedIn" to="/login">Login | </router-link>
    <router-link v-if="!isLoggedIn" to="/register">Register | </router-link>

    <router-link to="/viewBrands">View Brands & Perfumes | </router-link>

    <button v-if="isLoggedIn" class="logout-button" @click="logout">
      Logout
    </button>
  </nav>
  <router-view />
</template>

<script>

import { ref, watch } from "vue";
import { useStore } from "vuex";
import router from "@/router";

export default {
  setup() {
    const store = useStore();
    let isLoggedIn = ref(store.state.isLoggedIn);

    // Utilizează watch pentru a reacționa la modificările în Vuex
    watch(
      () => store.state.isLoggedIn,
      (newValue) => {
        isLoggedIn.value = newValue;
      }
    );

    function logout() {
      // Sterge tokenul din localStorage
      localStorage.removeItem("token");
      isLoggedIn.value = false;
      store.dispatch("logout");
      console.log("logout");

      // Redirecționează către pagina de login sau altă pagină după logout
      router.replace("/");
    }

    return { isLoggedIn, logout };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #363b4e;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #363b4e;

    &.router-link-exact-active {
      color: #927fbf;
    }
  }
}

.router-link,
.logout-button {
  font-weight: bold;
  color: #363b4e;
  text-decoration: none;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
}

.logout-button{
  background-color: transparent;
}

.router-link.router-link-exact-active,
.logout-button:hover {
  color: #a393eb;
  border-color:transparent ;
}
</style>
