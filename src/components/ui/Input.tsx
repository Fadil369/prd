import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "filled" | "outlined";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  variant = "default",
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const baseClasses = `
    w-full px-4 py-3 text-base
    placeholder-neutral-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-xl
  `;

  const variantClasses = {
    default: `
  border border-neutral-300 dark:border-neutral-700
  bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
  focus:border-primary-500 focus:ring-primary-500
  hover:border-neutral-400 dark:hover:border-neutral-600
    `,
    filled: `
  border border-transparent dark:border-neutral-700
  bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100
  focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-primary-500
  hover:bg-neutral-100 dark:hover:bg-neutral-700
    `,
    outlined: `
  border-2 border-neutral-300 dark:border-neutral-700
  bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100
  focus:border-primary-500 focus:ring-primary-500
  hover:border-neutral-400 dark:hover:border-neutral-600
    `,
  };

  const iconPadding = {
    left: leftIcon ? "ps-12" : "",
    right: rightIcon ? "pe-12" : "",
  };

  const errorClasses = error
    ? `
    border-red-300 focus:border-red-500 focus:ring-red-500
    bg-red-50
  `
    : "";

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${iconPadding.left}
    ${iconPadding.right}
    ${errorClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute start-0 top-0 h-full w-12 flex items-center justify-center text-neutral-400">
            {leftIcon}
          </div>
        )}

        <input id={inputId} className={combinedClasses} {...props} />

        {rightIcon && (
          <div className="absolute end-0 top-0 h-full w-12 flex items-center justify-center text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
};

export default Input;
