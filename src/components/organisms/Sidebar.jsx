import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", to: "/", icon: "BarChart3" },
    { name: "Students", to: "/students", icon: "Users" },
    { name: "Grades", to: "/grades", icon: "BookOpen" },
    { name: "Attendance", to: "/attendance", icon: "UserCheck" },
    { name: "Calendar", to: "/calendar", icon: "CalendarDays" },
    { name: "Reports", to: "/reports", icon: "FileText" },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-gradient-primary text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100"
        )
      }
      onClick={onClose}
    >
      {({ isActive }) => (
        <>
          <ApperIcon
            name={item.icon}
            className={cn(
              "mr-3 transition-colors",
              isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
            )}
            size={20}
          />
          {item.name}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="text-white" size={20} />
            </div>
            <span className="ml-3 text-xl font-display font-bold text-gradient">
              ClassHub
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                T
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Teacher</p>
                <p className="text-xs text-gray-500">Class Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="text-white" size={20} />
            </div>
            <span className="ml-3 text-xl font-display font-bold text-gradient">
              ClassHub
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;