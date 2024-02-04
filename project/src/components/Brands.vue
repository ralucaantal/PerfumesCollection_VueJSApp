<template>
  <div class="brand-container">
    <div>
      <h2>🫶🏻 {{ brands.name }}</h2>

      <button
        class="delete-btn"
        v-if="isLoggedIn"
        @click="deleteBrand(brands.id)"
      >
        Delete Brand
      </button>
      <button
        class="btn_toggle"
        @click="togglePerfumesVisibility(brands.id)"
        v-if="brands.id"
      >
        Toggle Perfumes
      </button>
    </div>
    <div class="brand-informations">
      <div v-if="brands.perfumes && brands.perfumes.length > 0">
        <p>Average Price: {{ averagePrice(brands.perfumes) }} 💰</p>
        <p>Average Rating: {{ averageRating(brands.perfumes) }} ⭐</p>
      </div>
      <p v-if="brands.perfumes">
        Founded on {{ brands.startDate }} in {{ brands.country }} and offering
        {{ brands.perfumes.length }} perfumes.
      </p>
    </div>
    <button
      class="add-update"
      v-if="isLoggedIn"
      @click="addUpdatePerfume(brands.id, brands.name)"
    >
      Add/Update A Perfume
    </button>
    <template v-if="showPerfumes && brands.id === selectedBrandId">
      <div v-for="perfume in brands.perfumes" :key="perfume.id" class="brands">
        <h3>{{ perfume.name }}</h3>
        <p>Ingredients: {{ perfume.ingredients.join(", ") }}</p>
        <p>Gender: {{ perfume.gender }}</p>
        <p>Price: {{ perfume.price }} 💰</p>
        <p>Rating: {{ perfume.rating }} ⭐</p>

        <div v-if="isLoggedIn">
          <p>
            Rate:
            <span v-for="star in 5" :key="star">
              <span
                @click="setRating(perfume.id, perfume.rating, brands.id, star)"
                :class="{ rated: star <= perfume.rating }"
              >
                ⭐
              </span>
            </span>
          </p>
        </div>

        <div v-if="isLoggedIn">
          <button
            class="delete-btn"
            @click="deletePerfume(perfume.id, brands.id)"
          >
            Delete Perfume
          </button>
          <!-- <button @click="updatePerfume(perfume.id, brands.id)">
            Update Perfume
          </button> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { requestOptions, base_url } from "@/utils/requestOptions";
import router from "@/router";
//import { mapActions } from 'vuex';
//import { useStore } from "vuex";
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
    setRating(perfumeId, currentRating, brandId, rating) {
      let newRating = (currentRating + rating) / 2;

      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "POST";

      let postData = {
        perfumeId: perfumeId,
        brandId: brandId,
        rating: newRating,
      };

      console.log(postData);

      localRequestOptions.body = JSON.stringify(postData);

      fetch(base_url + "rateAPerfume", localRequestOptions)
        .then(async (res) => {
          if (res.status === 200) {
            res.json().then((res) => {
              console.log(res);
              this.$emit("updateBrands", res.message);
            });
          } else {
            console.log("An error occurred while adding the perfume");
          }
        })
        .catch((error) => {
          console.error("Error during brand addition:", error);
        });
    },

    addUpdatePerfume(brandId, brandName) {
      console.log(
        "vreau sa adaug un parfum la brandul cu id:" + brandId + " " + brandName
      );
      router.replace("/addUpdatePerfume");
      this.$store.dispatch("transferData", { brandId, brandName });
      // router.push({
      //   name: "addUpdatePerfume",
      //   params: { brandId: brandId, brandName: brandName },
      // });
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
      } else if (this.brands && this.brands.id) {
        this.showPerfumes = true;
        this.selectedBrandId = brandId;
      } else {
        // Handle the case when this.brands is null or undefined
        console.error("Invalid 'brands' object:", this.brands);
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

.brand-container {
  border: 2px solid #887d92;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 25px;
  margin-right: 25px;
  background-color: #eeeaf0;
}

.brand-informations {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.btn_toggle {
  background-color: #4f3b78;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.delete-btn {
  background-color: #774181;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
