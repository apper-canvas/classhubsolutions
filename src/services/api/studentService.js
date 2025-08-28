import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    await this.delay();
    return [...this.students];
  }

  async getById(id) {
    await this.delay();
    return this.students.find(student => student.Id === parseInt(id));
  }

  async create(studentData) {
    await this.delay();
    const newId = Math.max(...this.students.map(s => s.Id)) + 1;
    const newStudent = {
      Id: newId,
      ...studentData,
      dateOfBirth: studentData.dateOfBirth || new Date().toISOString().split('T')[0]
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async update(id, studentData) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...studentData };
      return this.students[index];
    }
    throw new Error("Student not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.students.splice(index, 1);
      return deleted[0];
    }
    throw new Error("Student not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new StudentService();