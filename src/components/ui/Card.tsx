import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
}) => {
  const baseClasses = `
    rounded-2xl transition-all duration-300
  `;

  const variantClasses = {
    default: `
  bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800
      shadow-soft
    `,
    elevated: `
  bg-white dark:bg-neutral-900
  shadow-soft-lg
  border border-neutral-100 dark:border-neutral-800
    `,
    outlined: `
  bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800
  hover:border-primary-200 dark:hover:border-primary-400/40
    `,
    glass: `
  glass backdrop-blur-xl
  border border-white/20 dark:border-white/10
  bg-white/10 dark:bg-white/5
    `,
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  };

  const hoverClasses = hover
    ? `
    hover:shadow-soft-lg hover:scale-[1.02]
    hover:border-primary-200
    cursor-pointer
  `
    : "";

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <div className={combinedClasses}>{children}</div>;
};

export default Card;
