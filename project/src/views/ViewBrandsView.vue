<template>
  <div class="homeBrands">
    <div class="brands-list">
      <h1>Brands:</h1>
      <div class="sort-buttons">
        <button class="btn_sort" @click="toggleSortOrder('name')">
          Sort A-Z/Z-A
        </button>
        <!-- <button class="btn_sort" @click="toggleSortOrder('averageprice')">
          Sort by Price
        </button>
        <button class="btn_sort" @click="toggleSortOrder('averagerating')">
          Sort by Rating
        </button> -->
      </div>
      <button class="add-update" v-if="isLoggedIn" @click="addBrand">
        Add/Update Brand
      </button>
      <div v-for="(brandGroup, index) in paginatedBrands" :key="index" class="brands-container">
        <Brands :brands="brandGroup" @updateBrands="handleUpdateBrands" />
      </div>
      <div class="pagination">
        <button
          class="page-nav"
          @click="previousPage"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <span>{{ currentPage }}</span>
        <button
          class="page-nav"
          @click="nextPage"
          :disabled="currentPage * 3 >= brands.length"
        >
          Next
        </button>
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
        name: -1,
        // price: 1,
        // rating: 1,
      },
      currentPage: 1,
      brandsPerPage: 3,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    paginatedBrands() {
      const startIndex = (this.currentPage - 1) * this.brandsPerPage;
      const endIndex = startIndex + this.brandsPerPage;
      return this.brands.slice(startIndex, endIndex);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage * this.brandsPerPage < this.brands.length) {
        this.currentPage++;
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
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
    toggleSortOrder(key) {
      this.sortOrders[key] *= -1;
      this.sortBrands(key);
    },

    sortByPrice() {
      console.log("Sorting by price");
      this.sortBrands("price");
    },

    sortByRating() {
      console.log("Sorting by rating");
      this.sortBrands("rating");
    },

    sortBrands(key) {
      console.log("Sort key:", key);
      console.log("Sort orders:", this.sortOrders);
      this.brands.sort((a, b) => {
        const order = this.sortOrders[key];
        console.log("Comparing:", a, b);
        if (key === "name") {
          return order * a[key].localeCompare(b[key]);
        } else if (key === "averageprice") {
          console.log("Sorting by average price");
          return (
            order *
            (this.averagePrice(a.perfumes) - this.averagePrice(b.perfumes))
          );
        } else if (key === "averagerating") {
          console.log("Sorting by average rating");
          return (
            order *
            (this.averageRating(a.perfumes) - this.averageRating(b.perfumes))
          );
        }
      });

      console.log("Sorted brands:", this.brands);
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

.add-update {
  background-color: #4f3b78;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.page-nav {
  background-color: #927fbf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}

.page-nav:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
