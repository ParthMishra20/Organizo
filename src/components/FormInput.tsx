import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { combineAnimations, TRANSITIONS } from '../utils/animations';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isValid?: boolean;
  fullWidth?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  isValid,
  fullWidth = true,
  className,
  labelClassName,
  inputClassName,
  containerClassName,
  id,
  disabled,
  required,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = combineAnimations(
    'relative',
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    containerClassName
  );

  const labelClasses = combineAnimations(
    'block text-sm font-medium mb-1.5',
    darkModeClass(
      'text-foreground',
      'text-gray-700',
      'text-gray-200'
    ),
    labelClassName
  );

  const inputClasses = combineAnimations(
    // Base styles
    'block rounded-md shadow-sm',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    fullWidth && 'w-full',

    // Left icon padding
    leftIcon ? 'pl-10' : 'pl-4',
    // Right icon padding
    rightIcon || isValid || error ? 'pr-10' : 'pr-4',
    'py-2',

    // State-specific styles
    darkModeClass(
      // Default state
      !error && !disabled && 'border-input hover:border-gray-400 focus:border-primary focus:ring-primary/20',
      'bg-white border-gray-300',
      'bg-gray-900 border-gray-700'
    ),

    // Error state
    error && darkModeClass(
      'border-destructive focus:border-destructive focus:ring-destructive/20',
      'border-red-500',
      'border-red-500'
    ),

    // Valid state
    isValid && !error && darkModeClass(
      'border-green-500 focus:border-green-500 focus:ring-green-500/20',
      'border-green-500',
      'border-green-500'
    ),

    // Disabled state
    disabled && darkModeClass(
      'bg-muted cursor-not-allowed',
      'bg-gray-100',
      'bg-gray-800'
    ),

    inputClassName
  );

  const iconClasses = darkModeClass(
    'absolute top-1/2 -translate-y-1/2',
    'text-gray-400',
    'text-gray-500'
  );

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className={`${iconClasses} left-3`}>
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          disabled={disabled}
          required={required}
          {...props}
        />

        {/* Right icon */}
        {(rightIcon || isValid || error) && (
          <div className={`${iconClasses} right-3`}>
            {rightIcon || (error ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : isValid ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : null)}
          </div>
        )}
      </div>

      {/* Error message or hint */}
      {(error || hint) && (
        <div
          id={error ? `${inputId}-error` : `${inputId}-hint`}
          className={combineAnimations(
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

FormInput.displayName = 'FormInput';

/* Example usage:
<FormInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error={errors.email?.message}
/>

<FormInput
  label="Password"
  type="password"
  leftIcon={<Lock size={20} />}
  rightIcon={<Eye size={20} />}
  hint="Must be at least 8 characters"
/>

<FormInput
  value={username}
  onChange={handleChange}
  isValid={isUsernameAvailable}
  leftIcon={<User size={20} />}
/>
*/