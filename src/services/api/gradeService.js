import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await this.delay();
    return [...this.grades];
  }

  async getById(id) {
    await this.delay();
    return this.grades.find(grade => grade.Id === parseInt(id));
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.grades.filter(grade => grade.studentId === parseInt(studentId));
  }

  async create(gradeData) {
    await this.delay();
    const newId = Math.max(...this.grades.map(g => g.Id)) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      submittedDate: gradeData.submittedDate || new Date().toISOString()
    };
    this.grades.push(newGrade);
    return newGrade;
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      this.grades[index] = { ...this.grades[index], ...gradeData };
      return this.grades[index];
    }
    throw new Error("Grade not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.grades.splice(index, 1);
      return deleted[0];
    }
    throw new Error("Grade not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new GradeService();