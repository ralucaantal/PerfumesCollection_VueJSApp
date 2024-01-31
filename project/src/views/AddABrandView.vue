<template>
  <div class="homeBrands">
    <div class="mainBrands">
      <BrandsTable
        :brands="brands"
        class="brands-table"
        @rowClick="editBrand"
      />
      <button v-if="isLoggedIn" @click="toggleForm">Add Brand</button>
      <form v-show="showForm" @submit.prevent="addABrand">
        <h1>Add a New Brand</h1>
        <input
          type="text"
          placeholder="Name"
          class="input-field"
          v-model="name"
        />
        <input
          type="text"
          placeholder="Founding Date: dd/mm/yyyy"
          class="input-field"
          v-model="foundingDate"
        />
        <input
          type="text"
          placeholder="Country"
          class="input-field"
          v-model="country"
        />

        <div class="login-btn">
          <button class="btn1">Add</button>
        </div>
        <p>{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { requestOptions, base_url } from "@/utils/requestOptions";
import BrandsTable from "../components/BrandsTable.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    BrandsTable,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    editBrand(selectedBrand) {
      this.selectedBrandForEdit = selectedBrand;
      this.showForm = true;
    },
  },
  setup() {
    const name = ref("");
    const foundingDate = ref("");
    const message = ref("");
    const country = ref("");
    const brands = ref([]);

    const showForm = ref(false);

    function addABrand() {
      if (name.value === "" || foundingDate.value === "") {
        message.value = "Brand information cannot be null.";
      } else if (name.value && foundingDate.value) {
        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          name: name.value,
          startDate: foundingDate.value,
          country: country.value,
        };

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "addABrand", localRequestOptions)
          .then(async (res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                console.log(res);
                message.value = "Brand added successfully.";
                getCurrentBrands();
              });
            } else {
              console.log("An error occurred while adding the brand");
            }
          })
          .catch((error) => {
            console.error("Error during brand addition:", error);
          });
      }
    }

    function getCurrentBrands() {
      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "GET";
      fetch(base_url + "viewBrands", localRequestOptions)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            console.log("An error occurred while obtaining brands");
          }
        })
        .then((data) => {
          brands.value = data;
          console.log("Received brands:", brands.value);
        })
        .catch((error) => {
          console.error("Error during brand retrieval:", error);
        });
    }

    // Initial loading of brands
    getCurrentBrands();

    return {
      name,
      foundingDate,
      country,
      message,
      addABrand,
      brands,
      showForm,
    };
  },
};
</script>

<style>
.mainBrands {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
