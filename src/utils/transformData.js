export function transformEmployeeData(data, size = 1) {
    if (!data || !data.content || !data.totalPages) {
        return { employees: [], totalPages: 0 };
    }
    const employees = data.content.map(item => {
        const employee = item.employee;
        const department = item.department;
        return {
            ...employee,
            salary: Number(employee.salary),
            departmentName: department ? department.name : 'Không xác định'
        };
    });
    const totalPages = Math.ceil(data.totalPages / size);

    return { employees, totalPages };
}
