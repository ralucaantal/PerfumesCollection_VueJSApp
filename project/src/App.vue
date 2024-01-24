<template>
  <nav>
    <router-link to="/">Home</router-link> |
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
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
