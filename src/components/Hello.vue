<template>
  <div class="container">
    <div class="result" v-if="result">
      <h2>Kết quả:</h2>
      <p>{{ result }}</p>
    </div>
    <div class="error" v-else-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: null,
      error: null,
    };
  },
  mounted() {
    this.fetchGreeting(); // Gọi hàm khi component được mount
  },
  methods: {
    async fetchGreeting() {
      const name = this.$route.query.name || 'Sinh'; // Giá trị mặc định là 'Sinh'

      try {
        const response = await fetch(`http://localhost:8080/hello?name=${encodeURIComponent(name)}`);

        if (response.ok) {
          const data = await response.text();
          this.result = data;
          this.error = null;
        } else {
          throw new Error('Không thể lấy dữ liệu');
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        this.error = 'Có lỗi xảy ra khi lấy dữ liệu.';
        this.result = null;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.result, .error {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
}

.result {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>