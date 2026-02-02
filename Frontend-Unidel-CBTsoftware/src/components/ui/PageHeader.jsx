import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * PageHeader Component
 * Page title, description, and optional actions
 */
const PageHeader = ({
  title,
  description,
  children,
  actions,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("mb-3 sm:mb-6", className)}
    >
      <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-base text-gray-600">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:gap-3">{actions}</div>
        )}
      </div>
      {children}
    </motion.div>
  );
};

/**
 * Section Component
 * Content section with optional heading
 */
export const Section = ({
  title,
  description,
  icon,
  actions,
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        "bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="text-gray-600">
                {React.cloneElement(icon, {
                  className: "w-4 h-4 sm:w-5 sm:h-5",
                })}
              </span>
            )}
            <h3 className="text-sm sm:text-lg font-bold text-gray-900">
              {title}
            </h3>
          </div>
          {actions}
        </div>
      )}
      {description && (
        <p className="text-xs sm:text-sm text-gray-500 mb-4">{description}</p>
      )}
      {children}
    </motion.div>
  );
};

/**
 * Container Component
 * Max-width container for page content
 */
export const Container = ({ children, size = "xl", className = "" }) => {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-[1400px]",
    "2xl": "max-w-[1600px]",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx("mx-auto px-2 sm:px-4 md:px-6", sizes[size], className)}
    >
      {children}
    </div>
  );
};

/**
 * Grid Component
 * Responsive grid layouts
 */
export const Grid = ({ children, cols = 4, gap = "md", className = "" }) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  const gaps = {
    sm: "gap-2",
    md: "gap-2 sm:gap-4",
    lg: "gap-3 sm:gap-6",
  };

  return (
    <div className={clsx("grid", colClasses[cols], gaps[gap], className)}>
      {children}
    </div>
  );
};

export default PageHeader;
