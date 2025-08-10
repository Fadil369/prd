import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    touch-target rounded-xl
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600
      hover:from-primary-600 hover:to-primary-700
  text-white shadow-soft
      focus:ring-primary-500
      hover:shadow-glow hover:scale-[1.02]
      active:scale-[0.98]
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600
      hover:from-secondary-600 hover:to-secondary-700
  text-white shadow-soft
      focus:ring-secondary-500
      hover:shadow-glow-gold hover:scale-[1.02]
      active:scale-[0.98]
    `,
    outline: `
  border-2 border-primary-300 bg-white dark:bg-transparent dark:border-neutral-700
  hover:bg-primary-50 hover:border-primary-400 dark:hover:bg-neutral-800
  text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300
  focus:ring-primary-500
      hover:scale-[1.02] active:scale-[0.98]
    `,
    ghost: `
  bg-transparent hover:bg-primary-50 dark:hover:bg-neutral-800
  text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300
  focus:ring-primary-500
      hover:scale-[1.02] active:scale-[0.98]
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white shadow-soft
      focus:ring-red-500
      hover:shadow-soft-lg hover:scale-[1.02]
      active:scale-[0.98]
    `,
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm gap-2",
    md: "px-4 py-3 text-base gap-2",
    lg: "px-6 py-4 text-lg gap-3",
    xl: "px-8 py-5 text-xl gap-3",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const iconElement = isLoading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : icon ? (
    <span className="flex-shrink-0">{icon}</span>
  ) : null;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconElement && iconPosition === "left" && iconElement}
      {children && <span className="flex-1">{children}</span>}
      {iconElement && iconPosition === "right" && iconElement}
    </button>
  );
};

export default Button;
