<template>
  <div class="">

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
    async performSearch() {
      if (!this.searchQuery) {
        this.results = null;
        this.searched = false;
        return;
      }

      this.searched = true;

      try {
        const response = await fetch(`http://localhost:8080/hello?name=${encodeURIComponent(Llấy từ pram)}`);

        if (response.status === 404) {
          this.results = [];
        } else if (response.ok) {
          const data = await response.json();
          this.results = [data];
        } else {
          throw new Error('Lỗi không xác định');
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        this.results = [];
      }
    },
  },
};
</script>

<style scoped>

</style>