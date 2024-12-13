<template>
  <div class="employee-list">
    <h1>Danh sách nhân viên</h1>
    <table>
      <thead>
      <tr>
        <th>STT</th>
        <th>Tên</th>
        <th>Ngày sinh</th>
        <th>Giới tính</th>
        <th>Lương</th>
        <th>Điện thoại</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(employee, index) in employees" :key="employee.id">
        <td>{{ index + 1 }}</td>
        <td>{{ employee.name }}</td>
        <td>{{ employee.dob }}</td>
        <td>{{ employee.gender }}</td>
        <td>{{ employee.salary.toLocaleString() }} VNĐ</td>
        <td>{{ employee.phone }}</td>
        <td>
          <button class="view-button" @click="viewEmployee(employee)">Xem</button>
          <button class="edit-button" @click="editEmployee(employee)">Cập nhật</button>
          <button class="delete-button" @click="confirmDelete(employee.id)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button class="add-button" @click="openAddModal">Thêm Mới</button>

    <!-- Modal thêm và cập nhật nhân viên -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Cập nhật nhân viên' : 'Thêm nhân viên' }}</h2>
        <label>Tên:</label>
        <input v-model="employeeForm.name" type="text" required />
        <label>Ngày sinh:</label>
        <input v-model="employeeForm.dob" type="date" required />
        <label>Giới tính:</label>
        <select v-model="employeeForm.gender">
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
        <label>Lương:</label>
        <input v-model="employeeForm.salary" type="number" required />
        <label>Điện thoại:</label>
        <input v-model="employeeForm.phone" type="text" required />
        <button @click="isEditing ? updateEmployee() : addEmployee()">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
        <button @click="closeModal">Đóng</button>
      </div>
    </div>

    <!-- Xem chi tiết nhân viên -->
    <div v-if="showDetail" class="modal">
      <div class="modal-content">
        <h2>Chi tiết nhân viên</h2>
        <p><strong>Tên:</strong> {{ selectedEmployee.name }}</p>
        <p><strong>Ngày sinh:</strong> {{ selectedEmployee.dob }}</p>
        <p><strong>Giới tính:</strong> {{ selectedEmployee.gender }}</p>
        <p><strong>Lương:</strong> {{ selectedEmployee.salary.toLocaleString() }} VNĐ</p>
        <p><strong>Điện thoại:</strong> {{ selectedEmployee.phone }}</p>
        <button @click="closeDetail">Đóng</button>
      </div>
    </div>

    <!-- Xác nhận xóa nhân viên -->
    <div v-if="showConfirmDelete" class="modal">
      <div class="modal-content">
        <p>Bạn có chắc chắn muốn xóa nhân viên này không?</p>
        <button @click="deleteEmployee(confirmDeleteId)">Xóa</button>
        <button @click="cancelDelete">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employees: [],
      showModal: false,
      showDetail: false,
      showConfirmDelete: false,
      isEditing: false,
      selectedEmployee: {},
      employeeForm: {
        name: '',
        dob: '',
        gender: 'Male',
        salary: 0,
        phone: '',
      },
      confirmDeleteId: null,
    };
  },
  methods: {
    async fetchEmployees() {
      const response = await fetch('http://localhost:8080/api/employees');
      this.employees = await response.json();
    },
    async addEmployee() {
      await fetch('http://localhost:8080/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...this.employeeForm }), // Gửi dữ liệu thêm
      });
      this.closeModal();
      this.fetchEmployees();
    },
    async updateEmployee() {
      await fetch(`http://localhost:8080/api/employees/update/${this.selectedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...this.employeeForm, id: this.selectedEmployee.id }),
      });
      this.closeModal();
      this.fetchEmployees();
    },
    async deleteEmployee(id) {
      await fetch(`http://localhost:8080/api/employees/delete/${id}`, {
        method: 'DELETE',
      });
      this.closeConfirmDelete();
      this.fetchEmployees();
    },
    openAddModal() {
      this.isEditing = false;
      this.employeeForm = { name: '', dob: '', gender: 'Male', salary: 0, phone: '' };
      this.showModal = true;
    },
    editEmployee(employee) {
      this.isEditing = true;
      this.selectedEmployee = employee;
      this.employeeForm = { ...employee };
      this.showModal = true;
    },
    viewEmployee(employee) {
      this.selectedEmployee = employee;
      this.showDetail = true;
    },
    confirmDelete(id) {
      this.confirmDeleteId = id;
      console.log(this.confirmDeleteId);
      this.showConfirmDelete = true;
    },
    closeModal() {
      this.showModal = false;
    },
    closeDetail() {
      this.showDetail = false;
    },
    closeConfirmDelete() {
      this.showConfirmDelete = false;
    },
    cancelDelete() {
      this.closeConfirmDelete();
    },
  },
  mounted() {
    this.fetchEmployees();
  },
};
</script>

<style scoped>
.employee-list {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #e0e0e0;
}

button {
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #4CAF50;
  color: white;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.view-button {
  background-color: #FFC107;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  animation: fadeIn 0.3s ease;
}

.modal-content h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 1.5em;
  font-weight: bold;
}

label {
  display: block;
  font-weight: bold;
  margin: 10px 0 5px;
  color: #555;
}

input[type="text"],
input[type="date"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  border-color: #4CAF50;
  outline: none;
}

button {
  padding: 10px 15px;
  margin: 10px 5px 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  opacity: 0.9;
}

button:first-of-type {
  background-color: #4CAF50;
  color: white;
}

button:last-of-type {
  background-color: #f44336;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>