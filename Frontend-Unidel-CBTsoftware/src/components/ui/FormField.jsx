import React from "react";
import Input from "./Input";

/**
 * FormField Component
 * Wrapper for form inputs with label, error handling, and optional hint
 * Designed for use with React Hook Form
 */
const FormField = React.forwardRef(
  (
    {
      label,
      name,
      error,
      required = false,
      helperText,
      children,
      className = "",
      labelClassName = "",
      ...inputProps
    },
    ref,
  ) => {
    // If children are provided, render them instead of Input
    if (children) {
      return (
        <div className={className}>
          {label && (
            <label
              htmlFor={name}
              className={`block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 ${labelClassName}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {children}
          {error && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    // Default to Input component
    return (
      <Input
        ref={ref}
        id={name}
        name={name}
        label={required ? `${label} *` : label}
        error={error}
        helperText={helperText}
        className={className}
        {...inputProps}
      />
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
