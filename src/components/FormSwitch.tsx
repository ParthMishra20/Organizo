import React from 'react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

type SwitchSize = 'sm' | 'md' | 'lg';

interface FormSwitchProps {
  // Custom props
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  labelClassName?: string;
  switchClassName?: string;
  containerClassName?: string;
  labelPosition?: 'left' | 'right';
  size?: SwitchSize;
  icon?: React.ReactNode;

  // HTML input props we want to keep
  id?: string;
  name?: string;
  value?: string | number | readonly string[];
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  
  // Event handlers
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  
  // Aria props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

const sizes = {
  sm: {
    switch: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
    icon: 'h-2 w-2',
  },
  md: {
    switch: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
    icon: 'h-3 w-3',
  },
  lg: {
    switch: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-6',
    icon: 'h-4 w-4',
  },
};

export const FormSwitch = React.forwardRef<HTMLInputElement, FormSwitchProps>(({
  label,
  error,
  hint,
  isValid,
  className,
  labelClassName,
  switchClassName,
  containerClassName,
  labelPosition = 'right',
  size = 'md',
  icon,
  id,
  disabled,
  required,
  checked,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

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

  const switchClasses = cn(
    // Base styles
    'relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes[size].switch,

    // State-specific styles
    !disabled && !error && darkModeClass(
      'bg-input hover:bg-muted',
      'bg-gray-200 hover:bg-gray-300',
      'bg-gray-700 hover:bg-gray-600'
    ),

    // Checked state
    checked && !error && darkModeClass(
      'bg-primary',
      'bg-primary-600',
      'bg-primary-500'
    ),

    // Error state
    error && 'bg-destructive/50 focus:ring-destructive/20',

    // Valid state
    isValid && !error && 'bg-green-500 focus:ring-green-500/20',

    // Disabled state
    disabled && darkModeClass(
      'bg-muted cursor-not-allowed',
      'bg-gray-100',
      'bg-gray-800'
    ),

    switchClassName
  );

  const thumbClasses = cn(
    // Base styles
    'pointer-events-none inline-block rounded-full transform ring-0 transition duration-200 ease-in-out',
    'bg-white shadow-lg',
    sizes[size].thumb,

    // Translation
    checked ? sizes[size].translate : 'translate-x-0'
  );

  const iconClasses = cn(
    'absolute inset-0 flex items-center justify-center',
    sizes[size].icon,
    checked ? 'text-primary-foreground' : darkModeClass(
      'text-muted-foreground',
      'text-gray-400',
      'text-gray-500'
    )
  );

  const switchComponent = (
    <div className="relative inline-flex">
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        role="switch"
        className="sr-only"
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        disabled={disabled}
        required={required}
        checked={checked}
        {...props}
      />
      <div className={switchClasses}>
        <span className={thumbClasses}>
          {icon && <span className={iconClasses}>{icon}</span>}
        </span>
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* Label and switch layout */}
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
          {switchComponent}
          {labelPosition === 'right' && (
            <span className={labelClasses}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </span>
          )}
        </label>
      ) : (
        switchComponent
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

FormSwitch.displayName = 'FormSwitch';

/* Example usage:
import { Sun, Moon, Bell, BellOff } from 'lucide-react';

<FormSwitch
  label="Dark Mode"
  checked={isDarkMode}
  onChange={toggleDarkMode}
  icon={isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
/>

<FormSwitch
  label="Notifications"
  labelPosition="left"
  size="lg"
  checked={notifications}
  onChange={handleNotificationsChange}
  icon={notifications ? <Bell size={16} /> : <BellOff size={16} />}
/>

<FormSwitch
  label="Enable Feature"
  disabled={isSubmitting}
  error={errors.feature?.message}
  hint="This feature is in beta"
/>
*/