import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';

// Common types
interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// FormLabel Component
interface FormLabelProps extends BaseProps {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hideOptionalText?: boolean;
  infoTooltip?: string;
}

export function FormLabel({
  children,
  className,
  htmlFor,
  required,
  optional,
  hideOptionalText = false,
  infoTooltip,
}: FormLabelProps) {
  const showOptional = !required && optional && !hideOptionalText;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-medium',
          darkModeClass(
            'text-foreground',
            'text-gray-700',
            'text-gray-200'
          ),
          className
        )}
      >
        {children}
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
      </label>

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
  );
}

// FormError Component
interface FormErrorProps extends BaseProps {
  id?: string;
  icon?: boolean;
}

export function FormError({
  children,
  className,
  id,
  icon = true,
}: FormErrorProps) {
  if (!children) return null;

  return (
    <div
      id={id}
      role="alert"
      className={cn(
        'mt-1.5 text-sm text-destructive',
        'flex items-center gap-1',
        className
      )}
    >
      {icon && <AlertCircle className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

// FormHint Component
interface FormHintProps extends BaseProps {
  id?: string;
}

export function FormHint({
  children,
  className,
  id,
}: FormHintProps) {
  if (!children) return null;

  return (
    <div
      id={id}
      className={cn(
        'mt-1.5 text-sm',
        darkModeClass(
          'text-muted-foreground',
          'text-gray-500',
          'text-gray-400'
        ),
        className
      )}
    >
      {children}
    </div>
  );
}

// FormDescription Component
interface FormDescriptionProps extends BaseProps {}

export function FormDescription({
  children,
  className,
}: FormDescriptionProps) {
  if (!children) return null;

  return (
    <p
      className={cn(
        'text-sm',
        darkModeClass(
          'text-muted-foreground',
          'text-gray-500',
          'text-gray-400'
        ),
        className
      )}
    >
      {children}
    </p>
  );
}

/* Example usage:
<FormLabel 
  htmlFor="email" 
  required 
  infoTooltip="We'll never share your email"
>
  Email Address
</FormLabel>

<FormError id="email-error">
  Please enter a valid email address
</FormError>

<FormHint id="password-hint">
  Must be at least 8 characters
</FormHint>

<FormDescription>
  Your profile information will be displayed publicly
</FormDescription>

// In a form field:
<div className="space-y-1.5">
  <FormLabel htmlFor="name" required>
    Full Name
  </FormLabel>
  <input
    id="name"
    className="..."
    aria-describedby="name-error name-hint"
  />
  <FormError id="name-error">
    {errors.name?.message}
  </FormError>
  <FormHint id="name-hint">
    As it appears on your ID
  </FormHint>
</div>
*/