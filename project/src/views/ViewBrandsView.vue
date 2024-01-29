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
    let base_url = "http://localhost:3000/viewBrands";
    let requestOptions = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    };

    fetch(base_url, requestOptions).then((res) => {
      if (res.status === 200) {
        console.log("");
        res.json().then((res) => {
          this.brands = res;
        });
        console.log("ar fi trebuit sa fi primit lista de branduri");
      } else {
        console.log("A aparut o eroare");
      }
    });
  },
};
</script>
