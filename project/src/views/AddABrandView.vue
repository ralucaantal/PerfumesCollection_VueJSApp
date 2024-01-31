<template>
  <div class="main" @submit.prevent="addABrand">
    <form>
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

      <div class="login-btn">
        <button class="btn1">Add</button>
      </div>
      <p>{{ message }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { requestOptions, base_url } from "@/utils/requestOptions";
import router from "@/router";
export default {
  setup() {
    const name = ref("");
    const foundingDate = ref("");
    const message = ref("");

    // function convertToDate(dateString) {
    //   // Convert "dd/mm/yyyy" la formatul Date
    //   const [day, month, year] = dateString.split("/");
    //   return new Date(`${year}-${month}-${day}`);
    // }

    function addABrand() {
      if (name.value === "" || foundingDate.value === "") {
        message.value = "Brand informations cannot be null.";
      } else if (name.value && foundingDate.value) {
        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          name: name.value,
          startDate: foundingDate.value,
        };

        if (!postData.startDate) {
          message.value = "Invalid founding date format.";
          return;
        }

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "addABrand", localRequestOptions)
          .then(async (res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                this.$emit("updateBrands", res.message);
                router.replace("/viewBrands");
              });
            } else {
              console.log("A apărut o eroare la adaugarea");
            }
          })
          .catch((error) => {
            console.error(
              "Eroare în timpul cererii de ștergere a brandului:",
              error
            );
          });
      }
    }

    return { name, foundingDate, message, addABrand };
  },
};
</script>
