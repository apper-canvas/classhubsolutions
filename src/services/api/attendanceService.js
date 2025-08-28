import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getById(id) {
    await this.delay();
    return this.attendance.find(record => record.Id === parseInt(id));
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.attendance.filter(record => record.studentId === parseInt(studentId));
  }

  async getByDate(date) {
    await this.delay();
    return this.attendance.filter(record => 
      new Date(record.date).toDateString() === new Date(date).toDateString()
    );
  }

  async create(attendanceData) {
    await this.delay();
    const newId = Math.max(...this.attendance.map(a => a.Id)) + 1;
    const newRecord = {
      Id: newId,
      ...attendanceData,
      date: attendanceData.date || new Date().toISOString().split('T')[0]
    };
    this.attendance.push(newRecord);
    return newRecord;
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.attendance[index] = { ...this.attendance[index], ...attendanceData };
      return this.attendance[index];
    }
    throw new Error("Attendance record not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.attendance.splice(index, 1);
      return deleted[0];
    }
    throw new Error("Attendance record not found");
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new AttendanceService();