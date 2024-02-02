<template>
  <div>
   <h1>{{brandId}}</h1>
  </div>
</template>

<script>

import { useStore } from "vuex";
export default {
  setup() {
    
  },

  created() {
    const store = useStore();
    console.log(store.state.brandId);
    console.log(store.state.brandName);
  },
};
</script>
