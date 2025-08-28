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
  const [filterOpen, setFilterOpen] = useState(false);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (window.confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
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

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleGradeFilterChange = (grade) => {
    setGradeFilter(grade);
    setFilterOpen(false);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setGradeFilter("all");
    setStatusFilter("all");
setSearchTerm("");
    setFilterOpen(false);
  };

  const handleExportStudents = () => {
    try {
      // Prepare CSV data
      const csvHeaders = ['Name', 'Grade', 'Email', 'Status', 'Date of Birth'];
      const csvData = filteredStudents.map(student => [
        `${student.first_name_c || ''} ${student.last_name_c || ''}`.trim(),
        student.grade_c || '',
        student.email_c || '',
        student.status_c || '',
        student.date_of_birth_c ? new Date(student.date_of_birth_c).toLocaleDateString() : ''
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => 
          row.map(field => 
            // Escape commas and quotes in field values
            typeof field === 'string' && (field.includes(',') || field.includes('"')) 
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${filteredStudents.length} students successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export students. Please try again.');
    }
  };

  const activeFilterCount = (gradeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const filteredStudents = students.filter(student => {
    // Text search filter
    const matchesSearch = !searchTerm || 
      `${student.first_name_c} ${student.last_name_c}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.grade_c || '').toLowerCase().includes(searchTerm.toLowerCase());
// Grade filter - extract grade level from filter value (e.g., "10th" from "10th Grade")
const matchesGrade = gradeFilter === "all" || 
      student.grade_c === gradeFilter || 
      student.grade_c === gradeFilter.replace(' Grade', '') ||
      student.grade_c === gradeFilter.replace(/(\d+)\w+\s+Grade/, '$1');

    // Status filter
    const matchesStatus = statusFilter === "all" || student.status_c?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesGrade && matchesStatus;
  });

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
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFilterToggle}
              className={activeFilterCount > 0 ? "bg-primary/10 border-primary text-primary" : ""}
            >
              <ApperIcon name="Filter" size={16} className="mr-2" />
              Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Grade Level</label>
                    <select 
                      value={gradeFilter} 
                      onChange={(e) => handleGradeFilterChange(e.target.value)}
className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Grades</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => handleStatusFilterChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  
                  {activeFilterCount > 0 && (
                    <div className="pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="w-full text-gray-600 hover:text-gray-900"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
<Button variant="outline" size="sm" onClick={handleExportStudents}>
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