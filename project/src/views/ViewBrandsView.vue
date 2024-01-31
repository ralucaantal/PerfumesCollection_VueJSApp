<template>
  <div class="homeBrands">
    <div class="brands-list">
      <h1>Brands:</h1>
      <button v-if="isLoggedIn" @click="addBrand">Add Brand</button>
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
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
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
</style>
