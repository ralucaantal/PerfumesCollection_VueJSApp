<template>
  <div class="brands">
    <h1>{{ brands.name }}</h1>
    <p>Brandul are un numar de  parfumuri</p>
  </div>
</template>

<script>
export default {
  name: "ViewBrands",
  props: {
    brands: { type: Object },
  },

};
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
