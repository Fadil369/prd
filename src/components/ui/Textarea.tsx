import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "default" | "filled" | "outlined";
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  variant = "default",
  resize = "vertical",
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = `
    w-full min-h-[120px] px-4 py-3
    text-base placeholder-neutral-400
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

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
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
    ${resizeClasses[resize]}
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

      <textarea id={inputId} className={combinedClasses} {...props} />

      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
};

export default Textarea;
