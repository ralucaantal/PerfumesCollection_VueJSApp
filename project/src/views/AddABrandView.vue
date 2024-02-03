<template>
  <div class="homeBrands">
    <div class="mainBrands">
      <BrandsTable
        :brands="brands"
        class="brands-table"
        @rowClick="editABrand"
      />
      <button v-if="isLoggedIn" @click="toggleForm">Add Brand</button>
      <form v-show="showForm" @submit.prevent="handleSubmit">
        <h1>{{ editMode ? "Edit" : "Add" }} a Brand</h1>
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
          <button class="btn1">{{ editMode ? "Save" : "Add" }}</button>
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
  setup() {
    const name = ref("");
    const foundingDate = ref("");
    const message = ref("");
    const country = ref("");
    const brands = ref([]);

    const showForm = ref(false);
    const editMode = ref(false);

    const selectedBrandBD = ref(null);

    function addABrand() {
      let currentDate = new Date();
      let selectedDate = new Date(foundingDate.value);

      if (
        name.value === "" ||
        foundingDate.value === "" ||
        country.value === ""
      ) {
        message.value = "Brand information cannot be null.";
      } else if (selectedDate > currentDate) {
        message.value = "The brand's founding date must not be in the future!";
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
                name.value = "";
                foundingDate.value = "";
                country.value = "";
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

    function editABrand(selectedBrand) {
      console.log("Editing brand with id: " + selectedBrand.id);

      name.value = selectedBrand.name;
      foundingDate.value = selectedBrand.startDate;
      country.value = selectedBrand.country;

      selectedBrandBD.value = selectedBrand;

      editMode.value = true;

      // Show the form
      showForm.value = true;
    }

    function editBrandInBD(selectedBrand) {
      console.log(selectedBrand.id);

      let currentDate = new Date();
      let selectedDate = new Date(foundingDate.value);

      if (
        name.value === "" ||
        foundingDate.value === "" ||
        country.value === ""
      ) {
        message.value = "Brand information cannot be null.";
      } else if (selectedDate > currentDate) {
        message.value = "The brand's founding date must not be in the future!";
      } else if (name.value && foundingDate.value && country.value) {
        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          id: selectedBrand.id,
          name: name.value,
          startDate: foundingDate.value,
          country: country.value,
        };

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "editBrand", localRequestOptions)
          .then(async (res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                console.log(res);
                message.value = "Brand edited successfully.";
                resetForm();
                toggleForm();
                getCurrentBrands();
              });
            } else {
              message.value = "An error occurred while editing the brand";
            }
          })
          .catch((error) => {
            console.error("Error during brand addition:", error);
          });
      }
    }

    function handleSubmit() {
      if (editMode.value) {
        editBrandInBD({
          id: selectedBrandBD.value.id,
          name: name.value,
          startDate: foundingDate.value,
          country: country.value,
        });
      } else {
        addABrand();
      }
    }

    function toggleForm() {
      showForm.value = !showForm.value;

      // Reset the form and edit mode when hiding the form
      if (!showForm.value) {
        resetForm();
      }
    }

    function resetForm() {
      // Reset form fields
      name.value = "";
      foundingDate.value = "";
      country.value = "";

      editMode.value = false;

      message.value = "";
    }

    getCurrentBrands();

    return {
      name,
      foundingDate,
      country,
      message,
      addABrand,
      brands,
      showForm,
      handleSubmit,
      toggleForm,
      resetForm,
      editABrand,
      editMode,
      selectedBrandBD,
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
