import React from 'react';
import { Check } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  labelClassName?: string;
  checkboxClassName?: string;
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
  indeterminate?: boolean;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(({
  label,
  error,
  hint,
  isValid,
  className,
  labelClassName,
  checkboxClassName,
  containerClassName,
  labelPosition = 'right',
  indeterminate = false,
  id,
  disabled,
  required,
  checked,
  ...props
}, ref) => {
  // Handle indeterminate state
  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  // Generate unique ID if not provided
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = cn(
    'relative inline-flex items-center',
    disabled && 'opacity-50 cursor-not-allowed',
    containerClassName
  );

  const labelClasses = cn(
    'text-sm select-none',
    disabled ? darkModeClass(
      'text-muted-foreground cursor-not-allowed',
      'text-gray-400',
      'text-gray-500'
    ) : darkModeClass(
      'text-foreground',
      'text-gray-700',
      'text-gray-200'
    ),
    error && 'text-destructive',
    labelClassName
  );

  const checkboxClasses = cn(
    // Base styles
    'h-4 w-4 rounded',
    'border-2 border-solid',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',

    // State-specific styles
    !disabled && !error && darkModeClass(
      'border-input hover:border-primary',
      'border-gray-300 hover:border-primary-600',
      'border-gray-600 hover:border-primary-400'
    ),

    // Checked state
    checked && !error && darkModeClass(
      'bg-primary border-primary text-primary-foreground',
      'bg-primary-600 border-primary-600 text-white',
      'bg-primary-400 border-primary-400 text-gray-900'
    ),

    // Error state
    error && 'border-destructive focus:ring-destructive/20',

    // Valid state
    isValid && !error && 'border-green-500 focus:ring-green-500/20',

    // Disabled state
    disabled && darkModeClass(
      'bg-muted cursor-not-allowed',
      'bg-gray-100 border-gray-300',
      'bg-gray-800 border-gray-700'
    ),

    checkboxClassName
  );

  const checkbox = (
    <div className="relative inline-flex shrink-0">
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        className={cn(
          checkboxClasses,
          'appearance-none',
          'checked:bg-current',
        )}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        disabled={disabled}
        required={required}
        checked={checked}
        {...props}
      />
      {checked && !indeterminate && (
        <Check
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'h-3 w-3 pointer-events-none',
            darkModeClass(
              'text-primary-foreground',
              'text-white',
              'text-gray-900'
            )
          )}
        />
      )}
      {indeterminate && (
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'h-0.5 w-2 pointer-events-none',
            darkModeClass(
              'bg-primary-foreground',
              'bg-white',
              'bg-gray-900'
            )
          )}
        />
      )}
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* Label and checkbox layout */}
      {label ? (
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {labelPosition === 'left' && (
            <span className={labelClasses}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </span>
          )}
          {checkbox}
          {labelPosition === 'right' && (
            <span className={labelClasses}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </span>
          )}
        </label>
      ) : (
        checkbox
      )}

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

FormCheckbox.displayName = 'FormCheckbox';

/* Example usage:
<FormCheckbox
  label="Accept terms and conditions"
  required
  error={errors.terms?.message}
/>

<FormCheckbox
  label="Notifications"
  labelPosition="left"
  checked={notifications}
  onChange={handleNotificationsChange}
/>

<FormCheckbox
  indeterminate={someSelected}
  checked={allSelected}
  onChange={handleSelectAll}
  label="Select All"
/>

<FormCheckbox
  label="Remember me"
  disabled={isSubmitting}
  hint="Stay logged in for 30 days"
/>
*/