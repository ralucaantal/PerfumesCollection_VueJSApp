<template>
  <div class="home">
    <h1>Brands:</h1>
    <div v-for="i in brands" :key="i">
      <Brands :brands="i" />
    </div>
  </div>
</template>

<script>
import Brands from "../components/Brands.vue";
import { requestOptions, base_url } from "@/utils/requestOptions";

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
  created() {
    let localRequestOptions = { ...requestOptions };
    localRequestOptions.method = "GET";
    fetch(base_url + "viewBrands", localRequestOptions).then((res) => {
      if (res.status === 200) {
        console.log("");
        res.json().then((res) => {
          this.brands = res;
          console.log("Received brands:", this.brands);
        });
        console.log("ar fi trebuit sa fi primit lista de branduri");
      } else {
        console.log("A aparut o eroare");
      }
    });
  },
};
</script>
