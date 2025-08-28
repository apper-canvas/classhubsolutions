import React from "react";
import { cn } from "@/utils/cn";

const GradeBar = ({ score, maxScore, className }) => {
  const percentage = (score / maxScore) * 100;
  
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 80) return "bg-info";
    if (percentage >= 70) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{score}/{maxScore}</span>
        <span className="text-gray-600">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", getGradeColor(percentage))}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default GradeBar;