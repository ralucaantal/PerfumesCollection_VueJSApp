<template>
  <div class="homeBrands">
    <div class="brands-list">
      <h1>Brands:</h1>
      <div class="sort-buttons">
        <button class="btn_sort" @click="toggleSortOrder('name')">
          Sort A-Z/Z-A
        </button>
        <!-- <button @click="sortByPrice">Sort by Price</button>
        <button @click="sortByRating">Sort by Rating</button> -->
      </div>
      <button class="add-update" v-if="isLoggedIn" @click="addBrand">Add/Update Brand</button>
      <div v-for="i in brands" :key="i" class="brands-container">
        <Brands :brands="i" @updateBrands="handleUpdateBrands" />
      </div>
    </div>
  </div>
</template>

<script>
import Brands from "../components/Brands.vue";
import { requestOptions, base_url } from "@/utils/requestOptions";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "ViewBrandsView",
  components: {
    Brands,
  },
  data() {
    return {
      brands: [],
      sortOrders: {
        name: 1, // 1 pentru A-Z, -1 pentru Z-A
        price: 1,
        rating: 1,
      },
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    toggleSortOrder(key) {
      this.sortOrders[key] *= -1;
      this.sortBrands(key);
    },

    // sortByPrice() {
    //   console.log("Sorting by price");
    //   this.sortBrands("price");
    // },

    // sortByRating() {
    //   console.log("Sorting by rating");
    //   this.sortBrands("rating");
    // },

    sortBrands(key) {
      this.brands.sort((a, b) => {
        const order = this.sortOrders[key];
        if (key === "name") {
          return order * a[key].localeCompare(b[key]);
        } else {
          // Directly compare numbers for price and rating
          return order * (a[key] - b[key]);
        }
      });

      console.log("Sorted brands:", this.brands); // Adaugă această linie
    },

    sortAlphabetically() {
      this.sortBrands("name");
    },

    handleUpdateBrands(message) {
      console.log("ViewBrandsView.vue handleUpdateBrands: " + message);
      this.getCurrentBrands();
    },
    addBrand() {
      console.log("vreau sa adaug un Brand");
      router.replace("/addABrand");
    },
    getCurrentBrands() {
      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "GET";
      fetch(base_url + "viewBrands", localRequestOptions).then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            this.brands = res;
            console.log("Received brands:", this.brands);
          });
        } else {
          console.log("A aparut o eroare");
        }
      });
    },
  },
  created() {
    this.getCurrentBrands();
  },
};
</script>

<style>
.homeBrans {
  display: flex;
  justify-content: space-around;
}

.sort-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.btn_sort {
  background-color: #927fbf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.add-update{
  background-color: #FBBF24;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
