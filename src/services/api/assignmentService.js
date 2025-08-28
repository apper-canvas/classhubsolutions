import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getById(id) {
    await this.delay();
    return this.assignments.find(assignment => assignment.Id === parseInt(id));
  }

  async getByCategory(category) {
    await this.delay();
    return this.assignments.filter(assignment => assignment.category === category);
  }

  async create(assignmentData) {
    await this.delay();
    const newId = Math.max(...this.assignments.map(a => a.Id)) + 1;
    const newAssignment = {
      Id: newId,
      ...assignmentData,
      dueDate: assignmentData.dueDate || new Date().toISOString().split('T')[0]
    };
    this.assignments.push(newAssignment);
    return newAssignment;
  }

  async update(id, assignmentData) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.assignments[index] = { ...this.assignments[index], ...assignmentData };
      return this.assignments[index];
    }
    throw new Error("Assignment not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.assignments.splice(index, 1);
      return deleted[0];
    }
    throw new Error("Assignment not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new AssignmentService();