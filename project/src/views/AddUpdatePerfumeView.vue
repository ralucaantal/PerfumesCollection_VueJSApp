<template>
  <div class="homeBrands">
    <div class="mainBrands">
      <div class="table-container">
        <h1>Perfumes from brand: {{ brandName }}</h1>

        <template v-if="perfumes.length > 0">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ingredients</th>
                <th>Price</th>
                <th>Gender</th>
                <th>Rating</th>
                <!-- Alte coloane pot fi adăugate aici, în funcție de necesități -->
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(perfume, index) in displayedPerfumes"
                :key="index"
                @click="editPerfume(perfume)"
              >
                <td>{{ perfume.name }}</td>
                <td class="ingredients">
                  {{ formatIngredients(perfume.ingredients) }}
                </td>
                <td>{{ perfume.price }} $</td>
                <td>{{ perfume.gender }}</td>
                <td>{{ perfume.rating }}</td>
                <!-- Alte celule pot fi adăugate aici, în funcție de necesități -->
              </tr>
            </tbody>
          </table>
        </template>
        <div class="buttons">
          <button
            class="next-prev"
            v-if="perfumes.length > 5 && currentPage > 1"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <button
            class="next-prev"
            v-if="perfumes.length > 5 && currentPage * 5 < perfumes.length"
            @click="nextPage"
            :disabled="currentPage * 5 >= perfumes.length"
          >
            Next
          </button>
        </div>
        <button class="add-update" v-if="isLoggedIn" @click="toggleForm">
          Add Perfume
        </button>
      </div>
    </div>
    <div class="main" v-if="showForm" @submit.prevent="handleSubmit">
      <form class="form">
        <h1>{{ editMode ? "Edit" : "Add" }} a Perfume</h1>
        <input
          type="text"
          placeholder="Name"
          class="input-field"
          v-model="name"
        />
        <input
          type="text"
          placeholder="Ingredients: ingredient1, ingredient2, ..."
          class="input-field"
          v-model="ingredients"
        />

        <input
          type="text"
          placeholder="Price"
          class="input-field"
          v-model="price"
        />
        <input
          type="text"
          placeholder="Gender: uni/man/woman"
          class="input-field"
          v-model="gender"
        />
        <button class="btn1">{{ editMode ? "Save" : "Add" }}</button>
        <p>{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { requestOptions, base_url } from "@/utils/requestOptions";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  setup() {
    const store = useStore();
    const brandId = ref(null);
    const brandName = ref(null);
    const perfumes = ref([]);
    const displayedPerfumes = ref([]);
    const currentPage = ref(1);
    const showForm = ref(false);
    const name = ref("");
    const price = ref("");
    const ingredients = ref("");
    const gender = ref("");
    const message = ref("");
    const selectedPerfume = ref(null);
    const editMode = ref(false);

    onMounted(async () => {
      brandId.value = store.state.brandId;
      brandName.value = store.state.brandName;
      // isLoggedIn.value = store.getters.isLoggedIn;
      // console.log("Is Logged In:", isLoggedIn.value);
      await getCurrentPerfumes(brandId.value);
      updateDisplayedPerfumes();
    });

    const editPerfume = (perfume) => {
      // Setează parfumul curent ca "selectedPerfume" pentru editare
      selectedPerfume.value = { ...perfume };
      selectedPerfume.value = perfume;

      name.value = perfume.name;
      ingredients.value = perfume.ingredients.join(", ");
      price.value = perfume.price;
      gender.value = perfume.gender;

      editMode.value = !editMode.value;

      // Toggle form after setting values
      toggleForm();
    };

    const getCurrentPerfumes = async (brandId) => {
      let localRequestOptions = { ...requestOptions };
      localRequestOptions.method = "POST";

      let postData = {
        id: brandId,
      };

      localRequestOptions.body = JSON.stringify(postData);

      try {
        const res = await fetch(base_url + "viewPerfumes", localRequestOptions);
        if (res.status === 200) {
          const data = await res.json();
          perfumes.value = data;
          updateDisplayedPerfumes();
          console.log("Received perfumes:", perfumes.value);
        } else {
          console.log("A apărut o eroare");
        }
      } catch (error) {
        console.error("Error fetching perfumes:", error);
      }
    };

    const formatIngredients = (ingredients) => {
      return ingredients.join(", ");
    };

    const updateDisplayedPerfumes = () => {
      const startIndex = (currentPage.value - 1) * 5;
      displayedPerfumes.value = perfumes.value.slice(
        startIndex,
        startIndex + 5
      );
    };

    const nextPage = () => {
      currentPage.value++;
      updateDisplayedPerfumes();
    };

    const previousPage = () => {
      currentPage.value--;
      updateDisplayedPerfumes();
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;

      if (!showForm.value) resetForm();
    };

    function resetForm() {
      // Reset form fields
      name.value = "";
      ingredients.value = "";
      price.value = "";
      gender.value = "";

      editMode.value = false;
    }

    const addPerfume = () => {
      console.log("brandId: " + brandId.value);
      console.log("vreau sa adaug un parfum cu numele: " + name.value);
      console.log("ingrediente: " + ingredients.value);
      console.log("price: " + price.value);
      console.log("gender: " + gender.value);

      if (
        brandId.value === "" ||
        name.value === "" ||
        ingredients.value === "" ||
        price.value === "" ||
        gender.value === ""
      ) {
        message.value = "Perfume informations cannot be null.";
      } else if (!["uni", "woman", "man"].includes(gender.value)) {
        message.value = "Invalid gender. Please use 'uni', 'woman', or 'man'.";
      } else {
        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          name: name.value,
          ingredients: ingredients.value
            .split(", ")
            .map((ingredient) => ingredient.trim()),
          price: price.value,
          brandId: brandId.value,
          gender: gender.value,
          rating: 5,
        };

        console.log(postData);

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "addAPerfume", localRequestOptions)
          .then(async (res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                console.log(res);
                message.value = "Perfume added successfully.";
                getCurrentPerfumes(brandId.value);
                name.value = "";
                ingredients.value = "";
                price.value = "";
                gender.value = "";
                console.log(perfumes);
              });
            } else {
              message.value = "An error occurred while adding the perfume";
            }
          })
          .catch((error) => {
            console.error("Error during brand addition:", error);
          });
      }
    };

    const editPerfumeInBD = () => {
      console.log("brandId: " + brandId.value);
      console.log("vreau sa editez un parfum cu numele: " + name.value);
      console.log("ingrediente: " + ingredients.value);
      console.log("price: " + price.value);
      console.log("gender: " + gender.value);

      if (
        brandId.value === "" ||
        name.value === "" ||
        ingredients.value === "" ||
        price.value === "" ||
        gender.value === ""
      ) {
        message.value = "Perfume informations cannot be null.";
      } else if (!["uni", "woman", "man"].includes(gender.value)) {
        message.value = "Invalid gender. Please use 'uni', 'woman', or 'man'.";
      } else {
        let localRequestOptions = { ...requestOptions };
        localRequestOptions.method = "POST";

        let postData = {
          name: name.value,
          ingredients: Array.isArray(ingredients.value)
            ? ingredients.value // If already an array, use as is
            : ingredients.value
                .split(", ")
                .map((ingredient) => ingredient.trim()),
          price: price.value,
          brandId: brandId.value,
          gender: gender.value,
          rating: 0,
          perfumeId: selectedPerfume.value.id,
        };

        console.log(postData);

        localRequestOptions.body = JSON.stringify(postData);

        fetch(base_url + "editAPerfume", localRequestOptions)
          .then(async (res) => {
            if (res.status === 200) {
              res.json().then((res) => {
                console.log(res);
                message.value = "Perfume edited successfully.";
                getCurrentPerfumes(brandId.value);
                toggleForm();
                console.log(perfumes);
              });
            } else {
              message.value = "An error occurred while adding the perfume";
            }
          })
          .catch((error) => {
            console.error("Error during brand addition:", error);
          });
      }
    };

    const handleSubmit = () => {
      if (editMode.value === false) {
        addPerfume();
      } else {
        editPerfumeInBD();
      }
    };

    return {
      brandId,
      brandName,
      perfumes,
      displayedPerfumes,
      getCurrentPerfumes,
      formatIngredients,
      nextPage,
      previousPage,
      currentPage,
      showForm,
      toggleForm,
      addPerfume,
      name,
      ingredients,
      price,
      gender,
      message,
      editPerfume,
      selectedPerfume,
      editMode,
      handleSubmit,
      editPerfumeInBD,
      resetForm,
    };
  },
};
</script>

<style>
.main {
  margin-top: 30px;
}
.buttons {
  display: flex;
  justify-content: center;
}

table {
  width: 100%;
  margin-right: 30px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

td.ingredients {
  max-width: 180px; /* Adjust the max-width as per your design */
  word-wrap: break-word;
}

.next-prev {
  background-color: #b5a6d2;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
}

@media only screen and (max-width: 900px) {
  .mainBrands {
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    order: 3;
  }

  .form {
    margin-top: 20px;
    margin-left: 3px;
    margin-right: 3px;
    margin-bottom: 50px;
  }
}
</style>
