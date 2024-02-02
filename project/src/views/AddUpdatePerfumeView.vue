<template>
  <div>
    <h1>Perfumes for Brand {{ brandName }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brandId: null,
      brandName: null,
    };
  },
  created() {
    if (this.$route && this.$route.params) {
      console.log(this.$route.params);
      // Obține brandId din parametrii
      this.brandId = this.$route.params.brandId;
      this.brandName = this.$route.params.brandName;
    } else {
      console.error("Ruta sau parametrii rutei sunt indefiniți.");
    }
  },
};
</script>
