import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const AttendanceGrid = ({ students, attendance, currentDate = new Date() }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(
      a => (a.student_id_c?.Id || a.student_id_c) === studentId && isSameDay(new Date(a.date_c), date)
    );
    return record?.status_c || "none";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present": return "bg-success text-white";
      case "Absent": return "bg-error text-white";
      case "Late": return "bg-warning text-white";
      case "Excused": return "bg-info text-white";
      default: return "bg-gray-100 text-gray-400";
    }
  };

  const getStatusSymbol = (status) => {
    switch (status) {
      case "Present": return "P";
      case "Absent": return "A";
      case "Late": return "L";
      case "Excused": return "E";
      default: return "·";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Attendance for {format(currentDate, "MMMM yyyy")}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header with days */}
          <div className="flex bg-gray-50">
            <div className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
              Student
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="w-8 px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase"
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
          
{/* Student rows */}
          {students.slice(0, 10).map((student, index) => (
            <div
              key={student.Id}
              className={cn(
                "flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors",
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
            >
              <div className="w-48 px-4 py-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">
                  {student.first_name_c} {student.last_name_c}
                </div>
                <div className="text-xs text-gray-500">
                  Grade {student.grade_c}
                </div>
              </div>
              {days.map((day) => {
                const status = getAttendanceStatus(student.Id, day);
                return (
                  <div key={day.toISOString()} className="w-8 px-1 py-3 text-center">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                        getStatusColor(status)
                      )}
                    >
                      {getStatusSymbol(status)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-success mr-2"></div>
            <span>Present (P)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-error mr-2"></div>
            <span>Absent (A)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-warning mr-2"></div>
            <span>Late (L)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-info mr-2"></div>
            <span>Excused (E)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;