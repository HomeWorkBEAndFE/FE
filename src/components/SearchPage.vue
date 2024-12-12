  <template>
    <div class="search-page">
      <h1>Từ Điển</h1>
      <div class="search-container">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Nhập từ khóa..."
            @keyup.enter="performSearch"
        />
        <button @click="performSearch">Tìm kiếm</button>
      </div>
      <div v-if="searched && results">
        <h2>Kết quả tìm kiếm:</h2>
        <ul v-if="results.length">
          <li v-for="result in results" :key="result.id">
            {{ result.englishVocabulary }} - {{ result.vietNameVocabulary }}
          </li>
        </ul>
        <p v-else>Không tìm thấy từ vựng được tra trong từ điển.</p>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        results: null,
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
          const response = await fetch(`http://localhost:8080/api/dictionary/search?vocabulary=${encodeURIComponent(this.searchQuery)}`);

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
  .search-page {
    text-align: center;
    margin: 0 auto;
    width: 800px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
    margin-right: 10px;
    font-size: 16px;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
  }

  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }

  li {
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  li:hover {
    background-color: #f1f1f1;
  }

  .greeting {
    color: green;
    font-size: 18px;
    margin-top: 20px;
  }
  </style>