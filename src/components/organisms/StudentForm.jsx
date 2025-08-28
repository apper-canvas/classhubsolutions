import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const StudentForm = ({ student, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    dateOfBirth: "",
    parentContact: "",
    notes: "",
    status: "Active"
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        grade: student.grade || "",
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : "",
        parentContact: student.parentContact || "",
        notes: student.notes || "",
        status: student.status || "Active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        grade: "",
        dateOfBirth: "",
        parentContact: "",
        notes: "",
        status: "Active"
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.grade.trim()) newErrors.grade = "Grade is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ApperIcon name="X" size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>
          
          <FormField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              error={errors.grade}
              required
            />
            <FormField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />
          </div>
          
          <FormField
            label="Parent Contact"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
            placeholder="Parent phone number or email"
          />
          
          <FormField
            label="Status"
            error={errors.status}
          >
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </Select>
          </FormField>
          
          <FormField
            label="Notes"
          >
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Additional notes about the student..."
            />
          </FormField>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;