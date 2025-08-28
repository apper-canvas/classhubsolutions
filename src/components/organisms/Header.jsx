import React from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuToggle, searchValue, onSearchChange }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    if (path === "/students") return "Students";
if (path === "/grades") return "Grades";
    if (path === "/attendance") return "Attendance";
    if (path === "/calendar") return "Calendar";
    if (path === "/reports") return "Reports";
    return "ClassHub";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <h1 className="text-xl font-display font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search students, grades, or assignments..."
              className="w-80"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
              T
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:hidden mt-3">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search students, grades, or assignments..."
        />
      </div>
    </header>
  );
};

export default Header;