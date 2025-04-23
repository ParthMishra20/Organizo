import React from 'react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  options: RadioOption[];
  layout?: 'horizontal' | 'vertical';
  labelClassName?: string;
  radioClassName?: string;
  containerClassName?: string;
  optionClassName?: string;
}

export const FormRadio = React.forwardRef<HTMLInputElement, FormRadioProps>(({
  label,
  error,
  hint,
  options,
  layout = 'vertical',
  className,
  labelClassName,
  radioClassName,
  containerClassName,
  optionClassName,
  id: groupId,
  disabled,
  required,
  name,
  value,
  onChange,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const baseId = groupId || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = cn(
    'relative',
    disabled && 'opacity-50 cursor-not-allowed',
    containerClassName
  );

  const labelClasses = cn(
    'block text-sm font-medium mb-2',
    darkModeClass(
      'text-foreground',
      'text-gray-700',
      'text-gray-200'
    ),
    labelClassName
  );

  const optionsContainerClasses = cn(
    'space-y-2',
    layout === 'horizontal' && 'sm:space-y-0 sm:space-x-6 sm:flex sm:items-center',
    error && 'text-destructive'
  );

  const radioClasses = cn(
    // Base styles
    'h-4 w-4 rounded-full',
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
    'checked:border-[5px]',
    !error && darkModeClass(
      'checked:border-primary',
      'checked:border-primary-600',
      'checked:border-primary-400'
    ),

    // Error state
    error && 'border-destructive focus:ring-destructive/20',

    // Disabled state
    disabled && darkModeClass(
      'bg-muted cursor-not-allowed',
      'bg-gray-100 border-gray-300',
      'bg-gray-800 border-gray-700'
    ),

    radioClassName
  );

  const optionLabelClasses = cn(
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
    error && 'text-destructive'
  );

  const optionDescriptionClasses = cn(
    'mt-0.5 text-sm',
    darkModeClass(
      'text-muted-foreground',
      'text-gray-500',
      'text-gray-400'
    )
  );

  return (
    <div className={containerClasses}>
      {/* Group Label */}
      {label && (
        <div className={labelClasses}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </div>
      )}

      {/* Radio Options */}
      <div className={optionsContainerClasses} role="radiogroup">
        {options.map((option, index) => {
          const optionId = `${baseId}-${index}`;
          
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'flex items-start cursor-pointer',
                (disabled || option.disabled) && 'cursor-not-allowed',
                optionClassName
              )}
            >
              <div className="flex h-4 items-center">
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={disabled || option.disabled}
                  onChange={onChange}
                  className={radioClasses}
                  aria-invalid={!!error}
                  aria-describedby={
                    error ? `${baseId}-error` : hint ? `${baseId}-hint` : undefined
                  }
                  required={required}
                  {...props}
                />
              </div>
              <div className="ml-2">
                <div className={optionLabelClasses}>{option.label}</div>
                {option.description && (
                  <div className={optionDescriptionClasses}>
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Error message or hint */}
      {(error || hint) && (
        <div
          id={error ? `${baseId}-error` : `${baseId}-hint`}
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

FormRadio.displayName = 'FormRadio';

/* Example usage:
const options = [
  { 
    value: 'option1', 
    label: 'Option 1',
    description: 'This is a description for option 1'
  },
  { 
    value: 'option2', 
    label: 'Option 2',
    disabled: true
  },
  { 
    value: 'option3', 
    label: 'Option 3' 
  },
];

<FormRadio
  label="Select an option"
  options={options}
  value={selected}
  onChange={handleChange}
  required
/>

<FormRadio
  options={options}
  layout="horizontal"
  error={errors.selection?.message}
/>

<FormRadio
  label="Payment Method"
  options={paymentMethods}
  disabled={isSubmitting}
  hint="Choose your preferred payment method"
/>
*/