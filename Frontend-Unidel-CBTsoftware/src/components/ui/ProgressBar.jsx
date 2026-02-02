import React from "react";
import clsx from "clsx";

/**
 * ProgressBar Component
 * Linear progress indicator with optional label
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  color = "blue",
  size = "md",
  showLabel = false,
  label,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    orange: "bg-orange-500",
    purple: "bg-purple-600",
    gray: "bg-gray-600",
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
  };

  const sizes = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  };

  const getStatusColor = () => {
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 70) return "bg-blue-600";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs sm:text-sm text-gray-600">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size],
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-300",
            color === "auto" ? getStatusColor() : colors[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
