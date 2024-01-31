<template>
  <div class="brands">
    <h2>🫶🏻 {{ brands.name }}</h2>
    <div>
      <button v-if="isLoggedIn" @click="deleteBrand(brands.id)">
        Delete Brand
      </button>
      <button @click="togglePerfumesVisibility(brands.id)" v-if="brands.id">
        Toggle Perfumes
      </button>
    </div>
    <div v-if="brands.perfumes && brands.perfumes.length > 0">
      <p>Average Price: {{ averagePrice(brands.perfumes) }} 💰</p>
      <p>Average Rating: {{ averageRating(brands.perfumes) }} ⭐</p>
    </div>
    <p v-if="brands.perfumes">
      Founded on {{ brands.startDate }} in {{ brands.country }} and offering
      {{ brands.perfumes.length }} perfumes.
    </p>
    <button v-if="isLoggedIn">Add A Perfume</button>
    <template v-if="showPerfumes && brands.id === selectedBrandId">
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
          <button @click="updatePerfume(perfume.id, brands.id)">
            Update Perfume
          </button>
        </div>
      </div>
    </template>
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
  data() {
    return {
      showPerfumes: false,
      selectedBrandId: null,
    };
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
    addPerfume(brandId) {
      console.log("vreau sa adaug un parfum la brandul cu id:" + brandId);
      //router.replace("/addPerfume");
    },
    deletePerfume(perfumeId, brandId) {
      console.log("BRANDS.vue: PerfumeId: " + perfumeId, "BrandId: " + brandId);
      // Add logic to delete the brand
      //console.log(`Delete perfume with ID ${perfumeId}`);

      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "POST";
      let postData = {
        perfumeId: perfumeId,
        brandId: brandId,
      };

      localRequestOptions.body = JSON.stringify(postData);
      fetch(base_url + "deletePerfume", localRequestOptions)
        .then(async (res) => {
          if (res.status === 200) {
            res.json().then((res) => {
              this.$emit("updateBrands", res.message);
            });
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

    deleteBrand(brandId) {
      console.log("BRANDS.vue: " + "BrandId: " + brandId);
      // Add logic to delete the brand
      //console.log(`Delete perfume with ID ${perfumeId}`);

      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "POST";
      let postData = {
        brandId: brandId,
      };

      localRequestOptions.body = JSON.stringify(postData);
      fetch(base_url + "deleteBrand", localRequestOptions)
        .then(async (res) => {
          if (res.status === 200) {
            res.json().then((res) => {
              this.$emit("updateBrands", res.message);
            });
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

    averagePrice(perfumes) {
      const total = perfumes.reduce((sum, perfume) => sum + perfume.price, 0);
      const average = total / perfumes.length;
      return parseFloat(average.toFixed(2));
    },

    averageRating(perfumes) {
      const total = perfumes.reduce((sum, perfume) => sum + perfume.rating, 0);
      const average = total / perfumes.length;
      return parseFloat(average.toFixed(2));
    },

    togglePerfumesVisibility(brandId) {
      if (this.brands && this.brands.id && this.selectedBrandId === brandId) {
        this.showPerfumes = !this.showPerfumes;
      } else {
        this.showPerfumes = true;
        this.selectedBrandId = brandId;
      }
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
