<template>
  <div class="brands">
    <h2>{{ brands.name }}</h2>
    <p v-if="brands.perfumes">
      Founded on {{ brands.startDate }} and offering
      {{ brands.perfumes.length }} perfumes:
    </p>
    <div v-for="perfume in brands.perfumes" :key="perfume.id" class="brands">
      <h3>{{ perfume.name }}</h3>
      <p>Ingredients: {{ perfume.ingredients.join(", ") }}</p>
      <p>Gender: {{ perfume.gender }}</p>
      <p>Price: {{ perfume.price }} $</p>
      <p>Rating: {{ perfume.rating }}</p>
    </div>
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
