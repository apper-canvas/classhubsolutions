import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import GradesTable from "@/components/organisms/GradesTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import Select from "@/components/atoms/Select";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [gradesData, studentsData, assignmentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        assignmentService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditGrade = async (grade) => {
    const newScore = prompt("Enter new score:", grade.score);
    if (newScore !== null && !isNaN(newScore)) {
      try {
await gradeService.update(grade.Id, { ...grade, score_c: parseFloat(newScore) });
        await loadData();
        toast.success("Grade updated successfully!");
      } catch (err) {
        toast.error("Failed to update grade. Please try again.");
      }
    }
  };

  const handleDeleteGrade = async (grade) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
await gradeService.delete(grade.Id);
        await loadData();
        toast.success("Grade deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete grade. Please try again.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

const filteredGrades = grades.filter(grade => {
    const studentId = grade.student_id_c?.Id || grade.student_id_c;
    const assignmentId = grade.assignment_id_c?.Id || grade.assignment_id_c;
    const student = students.find(s => s.Id === studentId);
    const assignment = assignments.find(a => a.Id === assignmentId);
    
    const matchesSearch = student && (
      `${student.first_name_c} ${student.last_name_c}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment && assignment.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesCategory = selectedCategory === "all" || 
      (assignment && assignment.category_c === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(assignments.map(a => a.category))];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600">Track student performance and assignment scores</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
          <Button>
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Enter Grades
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by student name or assignment..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-48"
>
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Total Grades</div>
          <div className="text-2xl font-bold text-gray-900">{grades.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Average Score</div>
          <div className="text-2xl font-bold text-gray-900">
            {grades.length > 0 ? 
(grades.reduce((sum, g) => sum + (g.score_c || 0), 0) / grades.length).toFixed(1) + "%" : 
              "0%"
            }
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Assignments</div>
          <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card">
          <div className="text-sm text-gray-600">Students Graded</div>
          <div className="text-2xl font-bold text-gray-900">
{new Set(grades.map(g => g.student_id_c?.Id || g.student_id_c)).size}
          </div>
        </div>
      </div>

      {/* Grades Table */}
      {filteredGrades.length === 0 ? (
        <Empty
          title="No grades found"
          description={searchTerm || selectedCategory !== "all" ? 
            "No grades match your search criteria." : 
            "Start by creating assignments and entering student grades."
          }
          action={() => {}}
          actionText="Add Assignment"
          icon="BookOpen"
        />
      ) : (
        <GradesTable
grades={filteredGrades}
          assignments={assignments}
          students={students}
          onEdit={handleEditGrade}
          onDelete={handleDeleteGrade}
        />
      )}
    </div>
  );
};

export default Grades;