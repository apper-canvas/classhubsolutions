import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import assignmentService from "@/services/api/assignmentService";

const Reports = () => {
  const [reportData, setReportData] = useState({
    students: [],
    grades: [],
    attendance: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setReportData({
        students: studentsData,
        grades: gradesData,
        attendance: attendanceData,
        assignments: assignmentsData
      });
    } catch (err) {
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const generateClassReport = () => {
    const { students, grades, attendance } = reportData;
    
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "Active").length;
    const totalGrades = grades.length;
    const avgGrade = totalGrades > 0 ? 
      (grades.reduce((sum, g) => sum + g.score, 0) / totalGrades).toFixed(1) : "0";
    
    const totalAttendance = attendance.length;
    const presentCount = attendance.filter(a => a.status === "Present").length;
    const attendanceRate = totalAttendance > 0 ? 
      ((presentCount / totalAttendance) * 100).toFixed(1) : "0";

    return {
      totalStudents,
      activeStudents,
      avgGrade,
      attendanceRate,
      totalAssignments: reportData.assignments.length
    };
  };

  const generateStudentPerformance = () => {
    const { students, grades } = reportData;
    
    return students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.Id);
      const avgScore = studentGrades.length > 0 ? 
        (studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length).toFixed(1) : "0";
      
      return {
        name: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
        avgScore,
        totalGrades: studentGrades.length
      };
    });
  };

  const generateAttendanceSummary = () => {
    const { students, attendance } = reportData;
    
    return students.map(student => {
      const studentAttendance = attendance.filter(a => a.studentId === student.Id);
      const presentCount = studentAttendance.filter(a => a.status === "Present").length;
      const attendanceRate = studentAttendance.length > 0 ? 
        ((presentCount / studentAttendance.length) * 100).toFixed(1) : "0";
      
      return {
        name: `${student.firstName} ${student.lastName}`,
        totalDays: studentAttendance.length,
        presentDays: presentCount,
        attendanceRate
      };
    });
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReportData} />;
  }

  const classReport = generateClassReport();
  const studentPerformance = generateStudentPerformance();
  const attendanceSummary = generateAttendanceSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate comprehensive class and student performance reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <ApperIcon name="FileSpreadsheet" size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Class Overview */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Class Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{classReport.totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-success">{classReport.activeStudents}</div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{classReport.avgGrade}%</div>
            <div className="text-sm text-gray-600">Avg Grade</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-info">{classReport.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{classReport.totalAssignments}</div>
            <div className="text-sm text-gray-600">Assignments</div>
          </div>
        </div>
      </div>

      {/* Student Performance Report */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Student Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Grades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((student, index) => {
                const performanceLevel = parseFloat(student.avgScore) >= 90 ? "Excellent" :
                  parseFloat(student.avgScore) >= 80 ? "Good" :
                  parseFloat(student.avgScore) >= 70 ? "Fair" : "Needs Improvement";
                
                const performanceColor = parseFloat(student.avgScore) >= 90 ? "text-success" :
                  parseFloat(student.avgScore) >= 80 ? "text-info" :
                  parseFloat(student.avgScore) >= 70 ? "text-warning" : "text-error";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.avgScore}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalGrades}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${performanceColor}`}>
                      {performanceLevel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Attendance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceSummary.map((student, index) => {
                const rate = parseFloat(student.attendanceRate);
                const status = rate >= 95 ? "Excellent" :
                  rate >= 85 ? "Good" :
                  rate >= 75 ? "Fair" : "Poor";
                
                const statusColor = rate >= 95 ? "text-success" :
                  rate >= 85 ? "text-info" :
                  rate >= 75 ? "text-warning" : "text-error";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.presentDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.attendanceRate}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${statusColor}`}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;