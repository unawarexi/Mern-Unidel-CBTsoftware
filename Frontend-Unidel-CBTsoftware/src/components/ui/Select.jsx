import React from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import clsx from "clsx";

/**
 * Reusable Select Component
 * Styled dropdown with error state and icon support
 */
const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      placeholder = "Select an option",
      disabled = false,
      className = "",
      size = "md",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "px-3 py-2 text-sm pr-8",
      md: "px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base pr-10",
      lg: "px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg pr-12",
    };

    const variants = {
      default: error
        ? "border-red-500 focus:ring-red-100 focus:border-red-500"
        : "border-gray-200 focus:ring-blue-100 focus:border-blue-500",
      admin: error
        ? "border-red-500 focus:ring-red-100 focus:border-red-500"
        : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500",
    };

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={clsx(
              "w-full bg-white border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed",
              sizes[size],
              variants[variant],
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
