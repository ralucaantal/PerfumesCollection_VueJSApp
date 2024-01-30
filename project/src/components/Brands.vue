<template>
  <div class="brands">
    <h2>{{ brands.name }}</h2>
    <!-- <div v-if="isLoggedIn">
      <button @click="deleteBrand(brands)">Delete Brand</button>
      <button @click="updateBrand(brands.brandId)">Update Brand</button>
    </div> -->
    <div v-if="brands.perfumes && brands.perfumes.length > 0">
      <p>Average Price: {{ averagePrice(brands.perfumes) }} 💰</p>
      <p>Average Rating: {{ averageRating(brands.perfumes) }} ⭐</p>
    </div>
    <p v-if="brands.perfumes">
      Founded on {{ brands.startDate }} and offering
      {{ brands.perfumes.length }} perfumes:
    </p>
    <div v-for="perfume in brands.perfumes" :key="perfume.id" class="brands">
      <h3>{{ perfume.name }}</h3>
      <p>Ingredients: {{ perfume.ingredients.join(", ") }}</p>
      <p>Gender: {{ perfume.gender }}</p>
      <p>Price: {{ perfume.price }} 💰</p>
      <p>Rating: {{ perfume.rating }} ⭐</p>

      <div v-if="isLoggedIn">
        <button @click="deletePerfume(perfume.id, brands.id)">
          Delete Perfume
        </button>
        <button @click="updatePerfume(perfume.id)">Update Perfume</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { requestOptions, base_url } from "@/utils/requestOptions";

export default {
  name: "ViewBrands",
  props: {
    brands: { type: Object },
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  watch: {
    brands: function (newBrands) {
      console.log("Received brands:", newBrands);
    },
  },
  methods: {
    deletePerfume(perfumeId, brandId) {
      console.log(perfumeId, brandId);
      // Add logic to delete the brand
      console.log(`Delete perfume with ID ${perfumeId}`);

      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "POST";
      let postData = {
        perfumeId: perfumeId,
        brandId: brandId,
      };

      localRequestOptions.body = JSON.stringify(postData);
      fetch(base_url + "deletePerfume", localRequestOptions)
        .then((res) => {
          if (res.status === 200) {
            console.log("Parfumul a fost șters cu succes");
          } else {
            console.log("A apărut o eroare la ștergerea brandului");
          }
        })
        .catch((error) => {
          console.error(
            "Eroare în timpul cererii de ștergere a brandului:",
            error
          );
        });
    },
    // updateBrand(brandId) {
    //   // Add logic to update the brand
    //   console.log(`Update brand with ID ${brandId}`);
    // },
    averagePrice(perfumes) {
      const total = perfumes.reduce((sum, perfume) => sum + perfume.price, 0);
      return total / perfumes.length;
    },
    averageRating(perfumes) {
      const total = perfumes.reduce((sum, perfume) => sum + perfume.rating, 0);
      return total / perfumes.length;
    },
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
