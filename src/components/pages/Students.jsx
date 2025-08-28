import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewStudent = (student) => {
    // For this implementation, we'll treat view as edit
    handleEditStudent(student);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id);
        await loadStudents();
        toast.success("Student deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete student. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && selectedStudent) {
        await studentService.update(selectedStudent.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      }
      setIsFormOpen(false);
      await loadStudents();
    } catch (err) {
      toast.error("Failed to save student. Please try again.");
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage your class roster and student information</p>
        </div>
        <Button onClick={handleAddStudent} className="shrink-0">
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search students by name, email, or grade..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description={searchTerm ? "No students match your search criteria." : "Get started by adding your first student to the class roster."}
          action={!searchTerm ? handleAddStudent : undefined}
          actionText="Add First Student"
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
        />
      )}

      {/* Student Form Modal */}
      <StudentForm
        student={selectedStudent}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default Students;