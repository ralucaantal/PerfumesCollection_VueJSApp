<template>
  <div>
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
          <tr v-for="(perfume, index) in displayedPerfumes" :key="index">
            <td>{{ perfume.name }}</td>
            <td>{{ formatIngredients(perfume.ingredients) }}</td>
            <td>{{ perfume.price }} $</td>
            <td>{{ perfume.gender }}</td>
            <td>{{ perfume.rating }}</td>
            <!-- Alte celule pot fi adăugate aici, în funcție de necesități -->
          </tr>
        </tbody>
      </table>

      <button
        v-if="perfumes.length > 5 && currentPage > 1"
        @click="previousPage"
        :disabled="currentPage === 1"
      >
        Previous
      </button>

      <button
        v-if="perfumes.length > 5 && currentPage * 5 < perfumes.length"
        @click="nextPage"
        :disabled="currentPage * 5 >= perfumes.length"
      >
        Next
      </button>
    </template>
    <div class="login-btn">
      <button class="btn1" v-if="isLoggedIn" @click="toggleForm">
        Add Perfume
      </button>
    </div>
    <form v-if="showForm" @submit.prevent="addPerfume">
      <input
        type="text"
        placeholder="Name"
        class="input-field"
        v-model="name"
      />
      <button class="btn1">Add</button>
    </form>
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

    onMounted(async () => {
      brandId.value = store.state.brandId;
      brandName.value = store.state.brandName;
      // isLoggedIn.value = store.getters.isLoggedIn;
      // console.log("Is Logged In:", isLoggedIn.value);
      await getCurrentPerfumes(brandId.value);
      updateDisplayedPerfumes();
    });

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
    };

    const addPerfume = () => {
      console.log("vreau sa adaug un parfum cu numele" + name.value);
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
      name
    };
  },
};
</script>
