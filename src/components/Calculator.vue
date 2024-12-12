<template>
  <div>
    <h1>Máy Tính Đơn Giản</h1>
    <form @submit.prevent="calculate">
      <div>
        <label for="firstNumber">Số thứ nhất:</label>
        <input type="text" v-model="firstNumberStr" id="firstNumber" />
        <span v-if="errors.firstNumber" style="color: red;">{{ errors.firstNumber }}</span>
      </div>
      <div>
        <label for="secondNumber">Số thứ hai:</label>
        <input type="text" v-model="secondNumberStr" id="secondNumber" />
        <span v-if="errors.secondNumber" style="color: red;">{{ errors.secondNumber }}</span>
      </div>
      <div>
        <label for="operator">Phép toán:</label>
        <select v-model="operator" id="operator">
          <option  value="%2B" >Cộng</option>
          <option value="-">Trừ</option>
          <option value="*">Nhân</option>
          <option value="/">Chia</option>
        </select>
        <span v-if="errors.operatorError" style="color: red;">{{ errors.operatorError }}</span>
      </div>
      <button type="submit">Tính toán</button>
    </form>
    <h2>Kết quả: {{ result }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstNumberStr: '',
      secondNumberStr: '',
      operator: '%2B',
      result: null,
      errors: {},
    };
  },
  methods: {
    async calculate() {
      try {
        const response = await fetch(`http://localhost:8080/api/calculate?firstNumberStr=${this.firstNumberStr}&secondNumberStr=${this.secondNumberStr}&operator=${this.operator}`);

        if (!response.ok) {
          const data = await response.json();
          this.errors = data.errors;
          return;
        }

        const data = await response.json();
        this.result = data.result;
        this.errors = {};
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        this.result = 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
    },
  },
};
</script>

<style scoped>
div {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}

h2 {
  text-align: center;
  color: #333;
  margin-top: 20px;
}
</style>