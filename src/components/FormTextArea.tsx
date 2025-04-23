import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  fullWidth?: boolean;
  labelClassName?: string;
  textAreaClassName?: string;
  containerClassName?: string;
  showCount?: boolean;
  maxCount?: number;
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(({
  label,
  error,
  hint,
  isValid,
  fullWidth = true,
  className,
  labelClassName,
  textAreaClassName,
  containerClassName,
  id,
  disabled,
  required,
  showCount,
  maxCount,
  value,
  maxLength,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate character count
  const currentCount = typeof value === 'string' ? value.length : 0;
  const showCharacterCount = showCount || maxCount || maxLength;
  const limit = maxCount || maxLength;
  const isOverLimit = limit ? currentCount > limit : false;

  const containerClasses = cn(
    'relative',
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    containerClassName
  );

  const labelClasses = cn(
    'block text-sm font-medium mb-1.5',
    darkModeClass(
      'text-foreground',
      'text-gray-700',
      'text-gray-200'
    ),
    labelClassName
  );

  const textAreaClasses = cn(
    // Base styles
    'block w-full rounded-md shadow-sm resize-y min-h-[100px]',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    'px-4 py-2',

    // State-specific styles
    darkModeClass(
      'border',
      'bg-white border-gray-300',
      'bg-gray-900 border-gray-700'
    ),

    // Focus and hover states
    !error && !disabled && cn(
      'hover:border-gray-400',
      'focus:border-primary',
      'focus:ring-primary/20'
    ),

    // Error state
    (error || isOverLimit) && cn(
      'border-destructive',
      'focus:border-destructive',
      'focus:ring-destructive/20'
    ),

    // Valid state
    isValid && !error && !isOverLimit && cn(
      'border-green-500',
      'focus:border-green-500',
      'focus:ring-green-500/20'
    ),

    // Disabled state
    disabled && darkModeClass(
      'bg-muted cursor-not-allowed',
      'bg-gray-100',
      'bg-gray-800'
    ),

    textAreaClassName
  );

  return (
    <div className={containerClasses}>
      {/* Label */}
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {/* Character count */}
        {showCharacterCount && (
          <span
            className={cn(
              'text-xs',
              darkModeClass(
                'text-muted-foreground',
                'text-gray-500',
                'text-gray-400'
              ),
              isOverLimit && 'text-destructive'
            )}
          >
            {currentCount}
            {limit ? ` / ${limit}` : ' characters'}
          </span>
        )}
      </div>

      {/* TextArea wrapper */}
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          className={textAreaClasses}
          aria-invalid={!!error || isOverLimit}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        {/* Status icon */}
        {(error || isValid || isOverLimit) && (
          <div className="absolute top-2 right-2">
            {error || isOverLimit ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : isValid ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Error message or hint */}
      {(error || hint) && (
        <div
          id={error ? `${inputId}-error` : `${inputId}-hint`}
          className={cn(
            'mt-1.5 text-sm',
            error ? 'text-destructive' : darkModeClass(
              'text-muted-foreground',
              'text-gray-500',
              'text-gray-400'
            )
          )}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
});

FormTextArea.displayName = 'FormTextArea';

/* Example usage:
<FormTextArea
  label="Description"
  placeholder="Enter description"
  required
  error={errors.description?.message}
/>

<FormTextArea
  label="Bio"
  maxCount={500}
  showCount
  hint="Tell us about yourself"
/>

<FormTextArea
  value={notes}
  onChange={handleChange}
  isValid={isValidNotes}
  disabled={isSubmitting}
/>
*/