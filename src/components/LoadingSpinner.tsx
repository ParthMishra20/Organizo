import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizes[size]} ${className}`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      {spinner}
    </div>
  );
}

// Loading skeleton for cards
export function LoadingSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading state for buttons
export function LoadingButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center">
      <LoadingSpinner size="sm" className="mr-2" />
      {children}
    </div>
  );
}