import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import attendanceService from "@/services/api/attendanceService";
import studentService from "@/services/api/studentService";
import { format, addMonths, subMonths } from "date-fns";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceData, studentsData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll()
      ]);
      
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleTakeAttendance = () => {
    toast.info("Attendance taking feature would be implemented here!");
  };

  const calculateAttendanceStats = () => {
    const totalRecords = attendance.length;
    const presentRecords = attendance.filter(a => a.status === "Present").length;
    const absentRecords = attendance.filter(a => a.status === "Absent").length;
    const lateRecords = attendance.filter(a => a.status === "Late").length;
    
    const attendanceRate = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : "0";
    
    return {
      totalRecords,
      presentRecords,
      absentRecords,
      lateRecords,
      attendanceRate
    };
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const stats = calculateAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Monitor student attendance and track patterns</p>
        </div>
        <Button onClick={handleTakeAttendance}>
          <ApperIcon name="CheckCircle" size={16} className="mr-2" />
          Take Attendance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Attendance Rate</div>
          <div className="text-2xl font-bold text-success">{stats.attendanceRate}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Present</div>
          <div className="text-2xl font-bold text-gray-900">{stats.presentRecords}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Absent</div>
          <div className="text-2xl font-bold text-error">{stats.absentRecords}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Late</div>
          <div className="text-2xl font-bold text-warning">{stats.lateRecords}</div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-card">
        <Button
          variant="outline"
          onClick={handlePreviousMonth}
          className="flex items-center"
        >
          <ApperIcon name="ChevronLeft" size={16} className="mr-1" />
          Previous
        </Button>
        
        <h2 className="text-lg font-display font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        
        <Button
          variant="outline"
          onClick={handleNextMonth}
          className="flex items-center"
        >
          Next
          <ApperIcon name="ChevronRight" size={16} className="ml-1" />
        </Button>
      </div>

      {/* Attendance Grid */}
      {students.length === 0 ? (
        <Empty
          title="No students found"
          description="Add students to your class roster to start tracking attendance."
          action={() => {}}
          actionText="Add Students"
          icon="Users"
        />
      ) : (
        <AttendanceGrid
          students={students}
          attendance={attendance}
          currentDate={currentDate}
        />
      )}
    </div>
  );
};

export default Attendance;