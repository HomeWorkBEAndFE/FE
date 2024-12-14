<template>
  <div class="employee-list">
    <h1>Danh sách nhân viên</h1>

    <div class="search-form">
      <label for="searchName">Tên:</label>
      <input v-model="searchForm.name" type="text" id="searchName" placeholder="Tìm kiếm theo tên" />

      <label for="dobFrom">Ngày sinh từ:</label>
      <input v-model="searchForm.dobFrom" type="date" id="dobFrom" />

      <label for="dobTo">Ngày sinh đến:</label>
      <input v-model="searchForm.dobTo" type="date" id="dobTo" />

      <label for="gender">Giới tính:</label>
      <select v-model="searchForm.gender" id="gender">
        <option value="">Tất cả</option>
        <option value="Male">Nam</option>
        <option value="Female">Nữ</option>
      </select>

      <label for="salaryRange">Lương:</label>
      <input v-model="searchForm.salaryRange" type="text" id="salaryRange" placeholder="Tìm kiếm theo lương" />

      <label for="phone">Điện thoại:</label>
      <input v-model="searchForm.phone" type="text" id="phone" placeholder="Tìm kiếm theo điện thoại" />

      <label for="phone">Bộ phận:</label>
      <select v-model="searchForm.departmentId" id="department">
        <option v-for="department in departments" :key="department.id" :value="department.id">
          {{ department.name }}
        </option>
      </select>

      <button @click="searchEmployees">Tìm kiếm</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>STT</th>
        <th>Tên</th>
        <th>Ngày sinh</th>
        <th>Giới tính</th>
        <th>Lương</th>
        <th>Điện thoại</th>
        <th>Bộ phận</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(employee, index) in employees" :key="employee.id" >
        <td>{{ index + 1 }}</td>
        <td>{{ employee.name }}</td>
        <td>{{ employee.dob }}</td>
        <td>{{ employee.gender }}</td>
        <td>{{ employee.salary.toLocaleString() }} VNĐ</td>
        <td>{{ employee.phone }}</td>
        <td>{{employee.departmentName}}</td>
        <td>
          <button class="view-button" @click="viewEmployee(employee)">Xem</button>
          <button class="edit-button" @click="editEmployee(employee)">Cập nhật</button>
          <button class="delete-button" @click="confirmDelete(employee.id)">Xóa</button>
        </td>
      </tr>
      </tbody>
    </table>
    <button class="add-button" @click="openAddModal">Thêm Mới</button>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Cập nhật nhân viên' : 'Thêm nhân viên' }}</h2>
        <label for="name">Tên:</label>
        <input v-model="employeeForm.name" type="text" id="name" required />

        <label for="dob">Ngày sinh:</label>
        <input v-model="employeeForm.dob" type="date" id="dob" required />

        <label for="gender">Giới tính:</label>
        <select v-model="employeeForm.gender" id="gender">
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>

        <label for="salary">Lương:</label>
        <input v-model="employeeForm.salary" type="number" id="salary" required />

        <label for="phone">Điện thoại:</label>
        <input v-model="employeeForm.phone" type="text" id="phone" required />

        <label for="department">Bộ phận:</label>
        <select v-model="employeeForm.departmentId" id="department">
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
        <button @click="isEditing ? updateEmployee() : addEmployee()">
          {{ isEditing ? 'Cập nhật' : 'Thêm' }}
        </button>
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
        departmentId: 1,
        name: '',
        dob: '',
        gender: 'Male',
        salary: 0,
        phone: '', // Giá trị mặc định cho departmentId
      },
      departments: [
      ],
      confirmDeleteId: null,
      searchForm: {
        name: '',
        dobFrom: '',
        dobTo: '',
        gender: '',
        salaryRange: '',
        phone: '',
        departmentId:1,
      },
    };
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await fetch('http://localhost:8080/api/employees');
        const responseData = await response.json();
        console.log(responseData);
        if (Array.isArray(responseData.data)) {
          this.employees = responseData.data.map(item => {
            const employee = item.employee;
            const department = item.department;

            return {
              ...employee,
              salary: Number(employee.salary),
              departmentName: department ? department.name : 'Không xác định'
            };
          });
        }else {
          console.error('Dữ liệu không có trường "data" hoặc "data" không phải là mảng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu nhân viên:', error);
      }
      try {
        const responseDepartment = await fetch('http://localhost:8080/api/department');
        const responseDataDepartment = await responseDepartment.json();
        this.departments = responseDataDepartment.data.map(department => ({
          ...department,
        }));
        console.log(this.departments)// Cập nhật danh sách bộ phận
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },
    async addEmployee() {
      try {
        await fetch('http://localhost:8080/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.employeeForm),
        });
        this.closeModal();
        this.fetchEmployees();
      } catch (error) {
        console.error('Failed to add employee:', error);
      }
    },
    async updateEmployee() {

      const { departmentName, ...dataToUpdate } = this.employeeForm;
      console.log(dataToUpdate)

      try {
        await fetch(`http://localhost:8080/api/employees/update/${this.selectedEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpdate),
        });
        this.closeModal();
        this.fetchEmployees();
      } catch (error) {
        console.error('Failed to update employee:', error);
      }
    },
    async deleteEmployee(id) {
      try {
        await fetch(`http://localhost:8080/api/employees/delete/${id}`, {
          method: 'DELETE',
        });
        this.closeConfirmDelete();
        this.fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    },
    async searchEmployees() {
      try {
        const params = new URLSearchParams(this.searchForm).toString();
        const response = await fetch(`http://localhost:8080/api/employees/search?${params}`);
        const responseData = await response.json();
        console.log(responseData)
          this.employees = responseData.data.map(item => {
            const employee = item.employee;
            const department = item.department;

            return {
              ...employee,
              salary: Number(employee.salary),
              departmentName: department ? department.name : 'Không xác định'
            };
          });
        }catch (error) {
        console.error('Lỗi khi tìm kiếm nhân viên:', error);
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.employeeForm = { name: '', dob: '', gender: 'Male', salary: 0, phone: '' ,departmentId: 1,};
      this.showModal = true;
    },
    editEmployee(employee) {
      this.employeeForm = { name: '', dob: '', gender: 'Male', salary: 0, phone: '' ,departmentId: employee.departmentId};
      this.showModal = true;
      this.isEditing = true;
      this.selectedEmployee = employee;
      this.employeeForm = { ...employee };
      console.log(this.employeeForm);
      this.showModal = true;
    },
    viewEmployee(employee) {
      this.selectedEmployee = employee;
      this.showDetail = true;
    },
    confirmDelete(id) {
      this.confirmDeleteId = id;
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
  max-width: 1600px;
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
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f1f1f1;
}

.search-container input[type="text"],
.search-container input[type="date"],
.search-container select {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-container button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.search-container button:hover {
  opacity: 0.9;
}

.search-container label {
  font-weight: bold;
  margin-right: 10px;
  color: #555;
}

.modal-content h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 1.5em;
  font-weight: bold;
}

.modal-content input[type="text"],
.modal-content input[type="date"],
.modal-content input[type="number"],
.modal-content select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.modal-content input:focus,
.modal-content select:focus {
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
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f1f1f1;
}

.search-container input[type="text"],
.search-container input[type="date"],
.search-container select {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-container button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.search-container button:hover {
  opacity: 0.9;
}

.search-form {
  margin-bottom: 20px;
}

.search-form label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

.search-form input[type="text"],
.search-form input[type="date"],
.search-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 14px;
  box-sizing: border-box;
}

.search-form button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.search-form button:hover {
  opacity: 0.9;
}

</style>