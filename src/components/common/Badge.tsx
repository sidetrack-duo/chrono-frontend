import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline" | "primary" | "accent";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-50 text-primary",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
    outline: "text-gray-900 border border-gray-200",
    primary: "bg-primary-50 text-primary",
    accent: "bg-accent-50 text-accent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

