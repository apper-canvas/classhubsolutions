import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const StudentForm = ({ student, onSubmit, onCancel, isOpen }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    grade_c: "",
    date_of_birth_c: "",
    parent_contact_c: "",
    notes_c: "",
    status_c: "Active"
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        email_c: student.email_c || "",
        grade_c: student.grade_c || "",
        date_of_birth_c: student.date_of_birth_c ? student.date_of_birth_c.split('T')[0] : "",
        parent_contact_c: student.parent_contact_c || "",
        notes_c: student.notes_c || "",
        status_c: student.status_c || "Active"
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
    
if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Invalid email format";
    }
    if (!formData.grade_c.trim()) newErrors.grade_c = "Grade is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
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
              name="first_name_c"
              value={formData.first_name_c}
              onChange={handleChange}
              error={errors.first_name_c}
              required
            />
            <FormField
              label="Last Name"
              name="last_name_c"
              value={formData.last_name_c}
              onChange={handleChange}
              error={errors.last_name_c}
              required
            />
          </div>
          
          <FormField
            label="Email Address"
            type="email"
            name="email_c"
            value={formData.email_c}
            onChange={handleChange}
            error={errors.email_c}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Grade"
              name="grade_c"
              value={formData.grade_c}
              onChange={handleChange}
              error={errors.grade_c}
              required
            />
            <FormField
              label="Date of Birth"
              type="date"
              name="date_of_birth_c"
              value={formData.date_of_birth_c}
              onChange={handleChange}
              error={errors.date_of_birth_c}
              required
            />
          </div>
          
          <FormField
            label="Parent Contact"
            name="parent_contact_c"
            value={formData.parent_contact_c}
            onChange={handleChange}
            placeholder="Parent phone number or email"
          />
          
          <FormField
            label="Status"
            error={errors.status_c}
          >
            <Select
              name="status_c"
              value={formData.status_c}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </Select>
          </FormField>
          
          <FormField
            label="Notes"
          >
            <textarea
              name="notes_c"
              value={formData.notes_c}
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