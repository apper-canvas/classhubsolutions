import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Students from "@/components/pages/Students";
import GradesTable from "@/components/organisms/GradesTable";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    Name: "",
    category_c: "",
    total_points_c: "",
    due_date_c: "",
    weight_c: ""
  });
  const [gradeForm, setGradeForm] = useState({
    student_id_c: "",
    assignment_id_c: "",
    score_c: "",
    comments_c: ""
  });
  const [submitting, setSubmitting] = useState(false);

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

  // Assignment Modal Component
  const AssignmentModal = () => (
    showAssignmentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Assignment</h2>
            <button
              onClick={() => setShowAssignmentModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <form onSubmit={handleAddAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Name *
              </label>
<Input
                type="text"
                value={assignmentForm.Name}
                onChange={(e) => setAssignmentForm({...assignmentForm, Name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={assignmentForm.category_c}
                onChange={(e) => setAssignmentForm({...assignmentForm, category_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Mathematics">Mathematics</option>
                <option value="History">History</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Points *
              </label>
              <input
                type="number"
                value={assignmentForm.total_points_c}
                onChange={(e) => setAssignmentForm({...assignmentForm, total_points_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={assignmentForm.due_date_c}
                onChange={(e) => setAssignmentForm({...assignmentForm, due_date_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (%)
              </label>
              <input
                type="number"
                value={assignmentForm.weight_c}
                onChange={(e) => setAssignmentForm({...assignmentForm, weight_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAssignmentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Adding..." : "Add Assignment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Grade Modal Component
  const GradeModal = () => (
    showGradeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Enter Grade</h2>
            <button
              onClick={() => setShowGradeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <form onSubmit={handleEnterGrades} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student *
              </label>
              <select
                value={gradeForm.student_id_c}
                onChange={(e) => setGradeForm({...gradeForm, student_id_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.first_name_c} {student.last_name_c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment *
              </label>
              <select
                value={gradeForm.assignment_id_c}
                onChange={(e) => setGradeForm({...gradeForm, assignment_id_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Assignment</option>
                {assignments.map(assignment => (
                  <option key={assignment.Id} value={assignment.Id}>
                    {assignment.Name} ({assignment.category_c})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score *
              </label>
              <input
                type="number"
                value={gradeForm.score_c}
                onChange={(e) => setGradeForm({...gradeForm, score_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                value={gradeForm.comments_c}
                onChange={(e) => setGradeForm({...gradeForm, comments_c: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                placeholder="Optional comments about this grade..."
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGradeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Adding..." : "Add Grade"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!assignmentForm.Name || !assignmentForm.category_c || !assignmentForm.total_points_c || !assignmentForm.due_date_c) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      await assignmentService.create(assignmentForm);
      toast.success("Assignment created successfully!");
      
      // Reset form and close modal
      setAssignmentForm({
        Name: "",
        category_c: "",
        total_points_c: "",
        due_date_c: "",
        weight_c: ""
      });
      setShowAssignmentModal(false);
      
      // Reload data
      await loadData();
      
    } catch (error) {
      toast.error("Failed to create assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterGrades = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!gradeForm.student_id_c || !gradeForm.assignment_id_c || !gradeForm.score_c) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      await gradeService.create(gradeForm);
      toast.success("Grade entered successfully!");
      
      // Reset form and close modal
      setGradeForm({
        student_id_c: "",
        assignment_id_c: "",
        score_c: "",
        comments_c: ""
      });
      setShowGradeModal(false);
      
      // Reload data
      await loadData();
      
    } catch (error) {
      toast.error("Failed to enter grade. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  const categories = [...new Set(assignments.map(a => a.category_c).filter(Boolean))];

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
<Button variant="outline" onClick={() => setShowAssignmentModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
          <Button onClick={() => setShowGradeModal(true)}>
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
{/* Modals */}
      <AssignmentModal />
      <GradeModal />
    </div>
  );
};

export default Grades;