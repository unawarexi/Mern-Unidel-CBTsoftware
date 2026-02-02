import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import clsx from "clsx";

/**
 * Reusable Input Component
 * Types: text, email, password, number, tel, search
 * Supports error state, icons, and React Hook Form integration
 */
const Input = React.forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled = false,
      className = "",
      inputClassName = "",
      size = "md",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base",
      lg: "px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg",
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
          {leftIcon && (
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={clsx(
              "w-full bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed",
              sizes[size],
              variants[variant],
              leftIcon && "pl-10 sm:pl-12",
              (rightIcon || isPassword) && "pr-10 sm:pr-12",
              inputClassName,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
