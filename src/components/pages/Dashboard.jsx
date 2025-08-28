import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    students: [],
    grades: [],
    attendance: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setDashboardData({
        students: studentsData,
        grades: gradesData,
        attendance: attendanceData,
        assignments: assignmentsData
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const { students, grades, attendance } = dashboardData;
    
const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status_c === "Active").length;
    const totalGrades = grades.length;
    const avgGrade = totalGrades > 0 ? 
      (grades.reduce((sum, g) => sum + (g.score_c || 0), 0) / totalGrades).toFixed(1) : "0";
    
    const today = new Date().toDateString();
    const todayAttendance = attendance.filter(a => 
      new Date(a.date_c).toDateString() === today
    );
    const presentToday = todayAttendance.filter(a => a.status_c === "Present").length;
    const attendanceRate = todayAttendance.length > 0 ? 
      ((presentToday / todayAttendance.length) * 100).toFixed(1) : "0";
    return {
      totalStudents,
      activeStudents,
      avgGrade,
      attendanceRate: `${attendanceRate}%`
    };
  };

const getRecentActivity = () => {
    const { grades, attendance } = dashboardData;
    
    const recentGrades = grades
      .filter(g => g.submitted_date_c)
      .sort((a, b) => new Date(b.submitted_date_c) - new Date(a.submitted_date_c))
      .slice(0, 5);
    
    const recentAttendance = attendance
      .sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
      .slice(0, 5);

    return { recentGrades, recentAttendance };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading />
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const stats = calculateStats();
  const { recentGrades, recentAttendance } = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          gradient="primary"
          trend="up"
          trendValue={`${stats.activeStudents} active`}
        />
        <StatCard
          title="Average Grade"
          value={`${stats.avgGrade}%`}
          icon="BookOpen"
          gradient="secondary"
          trend="up"
          trendValue="2.3% from last week"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.attendanceRate}
          icon="Calendar"
          gradient="success"
          trend="up"
          trendValue="95.2% this week"
        />
        <StatCard
          title="Assignments"
          value={dashboardData.assignments.length}
          icon="FileText"
          gradient="accent"
          trend="up"
          trendValue="3 due this week"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Recent Grades
            </h3>
            <ApperIcon name="TrendingUp" className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {recentGrades.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent grades available</p>
            ) : (
              recentGrades.map((grade) => {
const student = dashboardData.students.find(s => s.Id === (grade.student_id_c?.Id || grade.student_id_c));
                const assignment = dashboardData.assignments.find(a => a.Id === (grade.assignment_id_c?.Id || grade.assignment_id_c));
                const percentage = assignment ? ((grade.score_c / assignment.total_points_c) * 100).toFixed(1) : "0";
                
                return (
                  <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student ? `${student.first_name_c} ${student.last_name_c}` : (grade.student_id_c?.Name || "Unknown Student")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {assignment ? assignment.Name : (grade.assignment_id_c?.Name || "Unknown Assignment")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{percentage}%</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(grade.submitted_date_c), "MMM dd")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Recent Attendance
            </h3>
            <ApperIcon name="Calendar" className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {recentAttendance.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent attendance records</p>
            ) : (
              recentAttendance.slice(0, 5).map((record) => {
const student = dashboardData.students.find(s => s.Id === (record.student_id_c?.Id || record.student_id_c));
                const statusColors = {
                  "Present": "text-success bg-success/10",
                  "Absent": "text-error bg-error/10",
                  "Late": "text-warning bg-warning/10",
                  "Excused": "text-info bg-info/10"
                };
                
                return (
                  <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student ? `${student.first_name_c} ${student.last_name_c}` : (record.student_id_c?.Name || "Unknown Student")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(record.date_c), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[record.status_c] || statusColors["Present"]}`}>
                      {record.status_c}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
            <ApperIcon name="UserPlus" className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-medium text-gray-900">Add Student</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
            <ApperIcon name="Plus" className="mx-auto mb-2 text-secondary group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-medium text-gray-900">New Assignment</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
            <ApperIcon name="CheckCircle" className="mx-auto mb-2 text-success group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-medium text-gray-900">Take Attendance</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
            <ApperIcon name="BarChart3" className="mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-medium text-gray-900">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;