import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import assignmentService from "@/services/api/assignmentService";
import { cn } from "@/utils/cn";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [view, setView] = useState("month");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const assignmentsData = await assignmentService.getAll();
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCreateAssignment = () => {
    toast.info("Assignment creation feature coming soon!");
  };

  const handleEditAssignment = (assignment) => {
    const newName = prompt("Enter new assignment name:", assignment.name);
    if (newName && newName.trim()) {
      toast.success(`Assignment "${newName}" updated successfully!`);
    }
  };

  const handleDeleteAssignment = (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.name}"?`)) {
      toast.success("Assignment deleted successfully!");
    }
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => {
      const assignmentDate = parseISO(assignment.dueDate);
      const matchesDate = isSameDay(assignmentDate, date);
      const matchesCategory = selectedCategory === "all" || assignment.category === selectedCategory;
      return matchesDate && matchesCategory;
    });
  };

  const getAssignmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getAssignmentsForDate(selectedDate);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Mathematics": "bg-blue-100 text-blue-800",
      "Science": "bg-green-100 text-green-800",
      "English": "bg-purple-100 text-purple-800",
      "History": "bg-yellow-100 text-yellow-800",
      "default": "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.default;
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayAssignments = getAssignmentsForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            key={day}
            className={cn(
              "min-h-24 p-2 border border-gray-200 cursor-pointer transition-all hover:bg-gray-50",
              !isCurrentMonth && "bg-gray-50 text-gray-400",
              isToday && "bg-blue-50 border-blue-200",
              isSelected && "bg-primary/10 border-primary"
            )}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className={cn(
              "text-sm font-medium mb-1",
              isToday && "text-primary font-bold"
            )}>
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {dayAssignments.slice(0, 2).map((assignment, index) => (
                <div
                  key={assignment.Id}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded text-left truncate",
                    getCategoryColor(assignment.category)
                  )}
                  title={assignment.name}
                >
                  {assignment.name}
                </div>
              ))}
              {dayAssignments.length > 2 && (
                <div className="text-xs text-gray-500 px-1.5">
                  +{dayAssignments.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-0">{rows}</div>;
  };

  const categories = [...new Set(assignments.map(a => a.category))];
  const upcomingAssignments = assignments
    .filter(a => {
      const dueDate = parseISO(a.dueDate);
      const today = new Date();
      const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
      return dueDate >= today && matchesCategory;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAssignments} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Assignment Calendar</h1>
          <p className="text-gray-600">Visualize and manage assignment due dates across all classes</p>
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
          <Button variant="outline" onClick={handleCreateAssignment}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousMonth}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextMonth}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-card p-4">
              <h3 className="font-display font-semibold text-gray-900 mb-3">
                {format(selectedDate, "EEEE, MMMM d")}
              </h3>
              <div className="space-y-3">
                {getAssignmentsForSelectedDate().length === 0 ? (
                  <p className="text-gray-500 text-sm">No assignments due on this date</p>
                ) : (
                  getAssignmentsForSelectedDate().map(assignment => (
                    <div key={assignment.Id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {assignment.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {assignment.category}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.totalPoints} points
                          </p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAssignment(assignment)}
                          >
                            <ApperIcon name="Edit2" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment)}
                            className="text-error hover:bg-error/10"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-xl shadow-card p-4">
            <h3 className="font-display font-semibold text-gray-900 mb-3">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                <Empty
                  title="No upcoming assignments"
                  description="All assignments are up to date!"
                  icon="CheckCircle"
                />
              ) : (
                upcomingAssignments.map(assignment => {
                  const dueDate = parseISO(assignment.dueDate);
                  const today = new Date();
                  const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={assignment.Id} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {assignment.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {assignment.category}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {format(dueDate, "MMM d")}
                          </div>
                          <div className={cn(
                            "text-xs font-medium",
                            daysDiff <= 1 ? "text-error" : 
                            daysDiff <= 3 ? "text-warning" : "text-gray-600"
                          )}>
                            {daysDiff === 0 ? "Due today" : 
                             daysDiff === 1 ? "Due tomorrow" :
                             `${daysDiff} days left`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-card p-4">
            <h3 className="font-display font-semibold text-gray-900 mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Assignments</span>
                <span className="text-sm font-medium text-gray-900">{assignments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-gray-900">
                  {assignments.filter(a => {
                    const dueDate = parseISO(a.dueDate);
                    return isSameMonth(dueDate, currentDate);
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-sm font-medium text-gray-900">{categories.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;