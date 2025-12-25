import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string | React.ReactNode;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, required, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-primary ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-10 py-2 text-sm text-gray-900 transition-all duration-200",
              "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              "appearance-none",
              error && "border-accent focus:border-accent focus:ring-accent",
              className
            )}
            required={required}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-accent-dark">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

