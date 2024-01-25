<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link> |
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

export default {
  setup() {
    // const router = useRouter();
    // const route = useRoute();
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
</style>
