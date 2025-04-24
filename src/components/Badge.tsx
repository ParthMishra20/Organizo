import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  icon,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';

  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    primary: 'bg-primary/10 text-primary dark:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    outline: 'border border-border text-foreground dark:text-foreground',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-0.5 gap-1.5',
    lg: 'text-base px-3 py-1 gap-2',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
}

// Predefined badge styles for common use cases
export const badgeVariants = {
  // Priority badges
  priority: {
    high: {
      variant: 'danger' as const,
      label: 'High',
    },
    medium: {
      variant: 'warning' as const,
      label: 'Medium',
    },
    low: {
      variant: 'success' as const,
      label: 'Low',
    },
  },
  
  // Status badges
  status: {
    completed: {
      variant: 'success' as const,
      label: 'Completed',
    },
    pending: {
      variant: 'warning' as const,
      label: 'Pending',
    },
    cancelled: {
      variant: 'danger' as const,
      label: 'Cancelled',
    },
  },
  
  // Budget badges
  budget: {
    onTrack: {
      variant: 'success' as const,
      label: 'On Track',
    },
    warning: {
      variant: 'warning' as const,
      label: 'Warning',
    },
    overBudget: {
      variant: 'danger' as const,
      label: 'Over Budget',
    },
  },
};

// Helper function to get badge style based on percentage
export function getBudgetBadgeVariant(percentage: number) {
  if (percentage <= 80) {
    return badgeVariants.budget.onTrack;
  } else if (percentage <= 100) {
    return badgeVariants.budget.warning;
  } else {
    return badgeVariants.budget.overBudget;
  }
}