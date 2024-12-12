<template>
  <div class="search-page">
    <h1>Tìm kiếm</h1>
    <input v-model="searchQuery" type="text" placeholder="Nhập từ khóa..." />
    <button @click="performSearch">Tìm kiếm</button>

    <div v-if="results.length">
      <h2>Kết quả tìm kiếm:</h2>
      <ul>
        <li v-for="(result, index) in results" :key="index">{{ result }}</li>
      </ul>
    </div>
    <div v-else-if="searched">
      <p>Không tìm thấy kết quả nào.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      results: [],
      searched: false,
    };
  },
  methods: {
    performSearch() {
      this.searched = true;
      // Giả lập kết quả tìm kiếm
      const allResults = ['Từ khóa 1', 'Từ khóa 2', 'Từ khóa 3'];
      this.results = allResults.filter(item =>
          item.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.search-page {
  text-align: center;
  margin-top: 50px;
}
input {
  padding: 10px;
  margin-right: 10px;
}
button {
  padding: 10px;
}
</style>