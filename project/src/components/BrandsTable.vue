<template>
  <div>
    <h1>Brands</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Founding Date</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="brand in brands" :key="brand.id">
          <td>{{ brand.name }}</td>
          <td>{{ brand.startDate }}</td>
          <td>{{ brand.country }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    brands: Array,
  },
};
</script>

<style>
/* Stilizează tabelul după preferințele tale */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
</style>
