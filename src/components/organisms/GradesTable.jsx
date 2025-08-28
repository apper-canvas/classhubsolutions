import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeBar from "@/components/molecules/GradeBar";
import { cn } from "@/utils/cn";

const GradesTable = ({ grades, assignments, students, onEdit, onDelete }) => {
  const getGradeStatus = (score, totalPoints) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return { variant: "success", text: "A" };
    if (percentage >= 80) return { variant: "info", text: "B" };
    if (percentage >= 70) return { variant: "warning", text: "C" };
    if (percentage >= 60) return { variant: "default", text: "D" };
    return { variant: "error", text: "F" };
  };

const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.first_name_c} ${student.last_name_c}` : "Unknown Student";
  };

  const getAssignmentName = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.Name : "Unknown Assignment";
  };

  const getAssignmentPoints = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.total_points_c : 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{grades.map((grade, index) => {
              const totalPoints = getAssignmentPoints(grade.assignment_id_c?.Id || grade.assignment_id_c);
              const gradeStatus = getGradeStatus(grade.score_c, totalPoints);
              
              return (
                <tr key={grade.Id} className={cn(
                  "hover:bg-gray-50 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grade.student_id_c?.Name || getStudentName(grade.student_id_c?.Id || grade.student_id_c)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {grade.assignment_id_c?.Name || getAssignmentName(grade.assignment_id_c?.Id || grade.assignment_id_c)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grade.score_c}/{totalPoints}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: "150px" }}>
                    <GradeBar score={grade.score_c} maxScore={totalPoints} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={gradeStatus.variant}>
                      {gradeStatus.text}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.submitted_date_c ? format(new Date(grade.submitted_date_c), "MMM dd") : "Not submitted"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(grade)}
                        className="text-gray-600 hover:bg-gray-100"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(grade)}
                        className="text-error hover:bg-error/10"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesTable;