import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false
}) => {
  const baseClasses = `
    rounded-2xl transition-all duration-300
  `;

  const variantClasses = {
    default: `
      bg-white border border-neutral-200
      shadow-soft
    `,
    elevated: `
      bg-white 
      shadow-soft-lg
      border border-neutral-100
    `,
    outlined: `
      bg-white border-2 border-neutral-200
      hover:border-primary-200
    `,
    glass: `
      glass backdrop-blur-xl
      border border-white/20
      bg-white/10
    `
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverClasses = hover ? `
    hover:shadow-soft-lg hover:scale-[1.02]
    hover:border-primary-200
    cursor-pointer
  ` : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;
