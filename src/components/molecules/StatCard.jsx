import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = "primary"
}) => {
  const gradients = {
    primary: "from-primary to-blue-600",
    secondary: "from-secondary to-purple-600", 
    accent: "from-accent to-orange-600",
    success: "from-success to-green-600",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              trend === "up" ? "text-success" : "text-error"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className="mr-1" 
              />
              {trendValue}
            </div>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white",
          gradients[gradient]
        )}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
        gradients[gradient]
      )} />
    </div>
  );
};

export default StatCard;