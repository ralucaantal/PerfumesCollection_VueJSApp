<template>
  <div>
    <h1> Perfumes from brand: {{ brandName }}</h1>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const brandId = ref(null);
    const brandName = ref(null);

    onMounted(() => {
      brandId.value = store.state.brandId;
      brandName.value = store.state.brandName;
    });

    return { brandId, brandName };
  },
};
</script>
