import React from 'react';
import { ChevronDown, AlertCircle, Check } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  fullWidth?: boolean;
  options: SelectOption[];
  value?: SelectOption['value'];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  labelClassName?: string;
  selectClassName?: string;
  containerClassName?: string;
  groupClassName?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  hint,
  isValid,
  fullWidth = true,
  options,
  value,
  placeholder,
  leftIcon,
  className,
  labelClassName,
  selectClassName,
  containerClassName,
  groupClassName,
  id,
  disabled,
  required,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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

  const selectGroupClasses = cn(
    'relative',
    groupClassName
  );

  const selectClasses = cn(
    // Base styles
    'block rounded-md shadow-sm appearance-none',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    fullWidth && 'w-full',

    // Padding based on icon
    leftIcon ? 'pl-10' : 'pl-4',
    'pr-10 py-2',

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
    error && cn(
      'border-destructive',
      'focus:border-destructive',
      'focus:ring-destructive/20'
    ),

    // Valid state
    isValid && !error && cn(
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

    selectClassName
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

      {/* Select wrapper */}
      <div className={selectGroupClasses}>
        {/* Left icon */}
        {leftIcon && (
          <div className={cn(iconClasses, 'left-3')}>
            {leftIcon}
          </div>
        )}

        {/* Select */}
        <select
          ref={ref}
          id={inputId}
          className={selectClasses}
          value={value}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <div className={cn(iconClasses, 'right-3 pointer-events-none')}>
          <ChevronDown className="h-5 w-5" />
        </div>

        {/* Status icon */}
        {(error || isValid) && (
          <div className={cn(iconClasses, 'right-8')}>
            {error ? (
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

FormSelect.displayName = 'FormSelect';

/* Example usage:
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', disabled: true },
  { value: 'option3', label: 'Option 3' },
];

<FormSelect
  label="Select Option"
  options={options}
  value={selectedValue}
  onChange={handleChange}
  placeholder="Choose an option"
  required
/>

<FormSelect
  label="Category"
  options={categories}
  leftIcon={<FolderIcon />}
  error={errors.category?.message}
/>

<FormSelect
  options={statusOptions}
  value={status}
  onChange={handleStatusChange}
  isValid={isStatusValid}
  disabled={isSubmitting}
/>
*/