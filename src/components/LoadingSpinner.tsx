import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { darkModeClass } from '../hooks/useDarkMode';
import { combineAnimations, TRANSITIONS } from '../utils/animations';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ 
  size = 24, 
  className = '',
  fullScreen = false,
  message: propMessage,
}: LoadingSpinnerProps) {
  const { message: contextMessage } = useLoading();
  const message = propMessage || contextMessage;

  const containerClasses = combineAnimations(
    'flex flex-col items-center justify-center gap-3',
    fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
    className
  );

  const spinnerClasses = combineAnimations(
    'animate-spin',
    darkModeClass(
      'text-primary',
      'text-primary-600',
      'text-primary-400'
    ),
    TRANSITIONS.default
  );

  const messageClasses = darkModeClass(
    'text-sm font-medium text-center',
    'text-gray-600',
    'text-gray-300'
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={containerClasses}
    >
      <Loader2 
        size={size}
        className={spinnerClasses}
      />
      {message && (
        <p className={messageClasses}>
          {message}
        </p>
      )}
      <span className="sr-only">
        {message || 'Loading...'}
      </span>
    </div>
  );
}

// Variants for common use cases
export function FullScreenLoader({ message }: { message?: string }) {
  return (
    <LoadingSpinner 
      size={32}
      fullScreen
      message={message}
    />
  );
}

export function InlineLoader({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <LoadingSpinner 
      size={size}
      className={`inline-flex ${className}`}
    />
  );
}

export function ButtonLoader({ size = 16 }: { size?: number }) {
  return (
    <LoadingSpinner 
      size={size}
      className="mr-2"
    />
  );
}

/* Example usage:
// Full screen loader
<FullScreenLoader message="Loading your data..." />

// Inline loader
<div>
  Loading items... <InlineLoader />
</div>

// Button loader
<button disabled>
  <ButtonLoader />
  Saving...
</button>

// Custom loader
<LoadingSpinner 
  size={24}
  className="my-4"
  message="Custom loading message"
/>
*/