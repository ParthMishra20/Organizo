import React from 'react';
import { Info } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

interface FormFieldGroupProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  infoTooltip?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
  hideOptionalText?: boolean;
}

export const FormFieldGroup = React.forwardRef<HTMLFieldSetElement, FormFieldGroupProps>(({
  children,
  label,
  description,
  hint,
  error,
  required,
  optional,
  infoTooltip,
  className,
  labelClassName,
  contentClassName,
  hideOptionalText = false,
  ...props
}, ref) => {
  const showOptional = !required && optional && !hideOptionalText;

  return (
    <fieldset
      ref={ref}
      className={cn(
        'min-w-0',
        error && 'animate-shake',
        className
      )}
      {...props}
    >
      {/* Header */}
      {(label || description) && (
        <div className="mb-4">
          {/* Label */}
          {label && (
            <div className="flex items-center gap-2">
              <legend
                className={cn(
                  'text-base font-semibold',
                  darkModeClass(
                    'text-foreground',
                    'text-gray-900',
                    'text-gray-100'
                  ),
                  labelClassName
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
                {showOptional && (
                  <span className={darkModeClass(
                    'text-muted-foreground ml-2 text-sm font-normal',
                    'text-gray-500',
                    'text-gray-400'
                  )}>
                    (Optional)
                  </span>
                )}
              </legend>

              {/* Info tooltip */}
              {infoTooltip && (
                <div className="relative group">
                  <Info 
                    className={cn(
                      'h-4 w-4 shrink-0',
                      darkModeClass(
                        'text-muted-foreground',
                        'text-gray-400 hover:text-gray-500',
                        'text-gray-500 hover:text-gray-400'
                      )
                    )}
                  />
                  <div className={cn(
                    'absolute left-1/2 -translate-x-1/2 bottom-full mb-2',
                    'w-48 p-2 rounded-md text-sm text-center',
                    'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                    'transition-all duration-200',
                    darkModeClass(
                      'bg-popover text-popover-foreground shadow-lg',
                      'bg-white text-gray-900 border border-gray-200',
                      'bg-gray-800 text-gray-100 border border-gray-700'
                    )
                  )}>
                    {infoTooltip}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className={cn(
              'mt-1 text-sm',
              darkModeClass(
                'text-muted-foreground',
                'text-gray-500',
                'text-gray-400'
              )
            )}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className={cn('space-y-4', contentClassName)}>
        {children}
      </div>

      {/* Hint or Error */}
      {(hint || error) && (
        <p className={cn(
          'mt-2 text-sm',
          error ? 'text-destructive' : darkModeClass(
            'text-muted-foreground',
            'text-gray-500',
            'text-gray-400'
          )
        )}>
          {error || hint}
        </p>
      )}
    </fieldset>
  );
});

FormFieldGroup.displayName = 'FormFieldGroup';

/* Example usage:
<FormFieldGroup
  label="Personal Information"
  description="Please provide your basic information"
  infoTooltip="This information will be used for your profile"
  required
>
  <FormInput
    label="Full Name"
    required
  />
  <FormInput
    label="Email"
    type="email"
    required
  />
  <FormInput
    label="Phone"
    optional
  />
</FormFieldGroup>

<FormFieldGroup
  label="Preferences"
  error={errors.preferences?.message}
>
  <FormCheckbox
    label="Email notifications"
  />
  <FormSwitch
    label="Dark mode"
  />
</FormFieldGroup>

<FormFieldGroup
  label="Additional Details"
  hint="All fields in this section are optional"
  optional
  hideOptionalText
>
  <FormTextArea
    label="Bio"
    placeholder="Tell us about yourself"
  />
  <FormInput
    label="Website"
    type="url"
  />
</FormFieldGroup>
*/