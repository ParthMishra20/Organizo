import React, { useState } from 'react';
import { useFormContext } from './Form';
import { Eye, EyeOff, Calendar, Search, X } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { TRANSITIONS, combineAnimations } from '../utils/animations';
import IconButton from './IconButton';

const ICON_STYLES = {
  light: 'text-gray-400',
  dark: 'text-gray-500',
} as const;

// Password Field
interface PasswordFieldProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  showPasswordByDefault?: boolean;
}

export function PasswordField({
  name,
  label,
  description,
  required,
  showPasswordByDefault = false,
  className,
  ...props
}: PasswordFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(showPasswordByDefault);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className={darkModeClass(
            "block text-sm font-medium",
            "text-gray-700",
            "text-gray-200"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          className={combineAnimations(
            "block w-full pr-10 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            darkModeClass(
              "border transition-colors",
              "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500",
              "border-gray-700 bg-gray-800 text-white focus:border-indigo-400 focus:ring-indigo-400"
            ),
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <IconButton
            icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            type="button"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
      {description && (
        <p className={darkModeClass(
          "text-sm",
          "text-gray-500",
          "text-gray-400"
        )}>
          {description}
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className={combineAnimations(
            "text-sm text-red-500",
            TRANSITIONS.default,
            "animate-slideIn"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Search Field with clear button
interface SearchFieldProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
  onClear?: () => void;
}

export function SearchField({
  name,
  label,
  onClear,
  className,
  ...props
}: SearchFieldProps) {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const value = watch(name);

  const handleClear = () => {
    setValue(name, '');
    onClear?.();
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className={darkModeClass(
            "block text-sm font-medium",
            "text-gray-700",
            "text-gray-200"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            size={16}
            className={darkModeClass(
              "transition-colors",
              ICON_STYLES.light,
              ICON_STYLES.dark
            )}
          />
        </div>
        <input
          id={name}
          type="search"
          className={combineAnimations(
            "block w-full pl-10 pr-10 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            darkModeClass(
              "border transition-colors",
              "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500",
              "border-gray-700 bg-gray-800 text-white focus:border-indigo-400 focus:ring-indigo-400"
            ),
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
          {...props}
        />
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <IconButton
              icon={<X size={16} />}
              onClick={handleClear}
              aria-label="Clear search"
              type="button"
              variant="ghost"
              size="sm"
            />
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className={combineAnimations(
            "text-sm text-red-500",
            TRANSITIONS.default,
            "animate-slideIn"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Date Field with calendar icon
interface DateFieldProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export function DateField({
  name,
  label,
  description,
  required,
  className,
  ...props
}: DateFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className={darkModeClass(
            "block text-sm font-medium",
            "text-gray-700",
            "text-gray-200"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar
            size={16}
            className={darkModeClass(
              "transition-colors",
              ICON_STYLES.light,
              ICON_STYLES.dark
            )}
          />
        </div>
        <input
          id={name}
          type="date"
          className={combineAnimations(
            "block w-full pl-10 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            darkModeClass(
              "border transition-colors",
              "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500",
              "border-gray-700 bg-gray-800 text-white focus:border-indigo-400 focus:ring-indigo-400"
            ),
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register(name)}
          {...props}
        />
      </div>
      {description && (
        <p className={darkModeClass(
          "text-sm",
          "text-gray-500",
          "text-gray-400"
        )}>
          {description}
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className={combineAnimations(
            "text-sm text-red-500",
            TRANSITIONS.default,
            "animate-slideIn"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* Example usage:
function LoginForm() {
  return (
    <Form schema={loginSchema} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <SearchField
          name="search"
          label="Search"
          placeholder="Search..."
          onClear={() => {
            // Handle clear
          }}
        />
        
        <PasswordField
          name="password"
          label="Password"
          required
          description="Must be at least 8 characters"
        />
        
        <DateField
          name="date"
          label="Select Date"
          required
        />
        
        <Button type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}
*/