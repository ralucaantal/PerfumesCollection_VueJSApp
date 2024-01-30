<template>

    <div class="main">
      <form>
        <h1>Add a New Brand</h1>
        <input type="text" placeholder="Name" class="input-field" />
        <!-- <v-date-picker
          v-model="foundingDate"
          label="Founding Date"
          class="input-field"
        ></v-date-picker> -->

        <div class="login-btn">
          <button class="btn1">Add</button>
        </div>
      </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      foundingDate: null,
    };
  },
  setup() {
    return {};
  },
};
</script>
