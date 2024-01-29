<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |
    <button class="logout-button" @click="logout">Logout</button>
  </nav>
  <router-view />
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import { onBeforeMount } from "vue";
// import { useRouter, useRoute } from "vue-router";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import router from "@/router";

export default {
  setup() {
    // const router = useRouter();
    // const route = useRoute();
  },

  methods: {
    logout() {
      // Sterge tokenul din localStorage
      localStorage.removeItem("token");
      console.log("logout");
      // Redirecționează către pagina de login sau altă pagină după logout
      router.replace("/");
    },
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
