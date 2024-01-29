<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |

    <!-- Utilizează v-if pentru a verifica existența tokenului în localStorage -->
    <button v-if="isLoggedIn" class="logout-button" @click="logout">
      Logout
    </button>
  </nav>
  <router-view />
</template>

<script>
//import { onBeforeUnmount } from "vue";
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
  color: #27296d;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #363b4e;

    &.router-link-exact-active {
      color: #a393eb;
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

.router-link.router-link-exact-active,
.logout-button:hover {
  color: #a393eb;
}
</style>
