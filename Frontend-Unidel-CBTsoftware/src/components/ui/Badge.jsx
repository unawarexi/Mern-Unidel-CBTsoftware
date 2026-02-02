import React from "react";
import clsx from "clsx";

/**
 * Badge Component
 * Status badges with color variants
 */
const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
    purple: "bg-purple-100 text-purple-700",
  };

  const dotColors = {
    default: "bg-gray-500",
    primary: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-orange-500",
    danger: "bg-red-500",
    info: "bg-cyan-500",
    purple: "bg-purple-500",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs sm:text-sm px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
