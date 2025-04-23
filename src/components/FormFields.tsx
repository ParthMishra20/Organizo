import React from 'react';
import { useFormContext } from './Form';
import { Check, ChevronDown } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { TRANSITIONS, combineAnimations } from '../utils/animations';

// Base field props
interface BaseFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Textarea Field
interface TextareaFieldProps extends 
  BaseFieldProps,
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>
{}

export function TextareaField({
  name,
  label,
  description,
  required,
  className,
  rows = 3,
  ...props
}: TextareaFieldProps) {
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
      <textarea
        id={name}
        rows={rows}
        className={combineAnimations(
          "block w-full rounded-md shadow-sm resize-y min-h-[80px]",
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

// Select Field
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends
  BaseFieldProps,
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'>
{
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  name,
  label,
  description,
  required,
  options,
  placeholder,
  className,
  ...props
}: SelectFieldProps) {
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
        <select
          id={name}
          className={combineAnimations(
            "block w-full appearance-none rounded-md pr-10 shadow-sm",
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={darkModeClass(
            "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
            "text-gray-400",
            "text-gray-500"
          )}
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

// Checkbox Field
interface CheckboxFieldProps extends
  BaseFieldProps,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>
{}

export function CheckboxField({
  name,
  label,
  description,
  className,
  ...props
}: CheckboxFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            type="checkbox"
            className={combineAnimations(
              "h-4 w-4 rounded",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              darkModeClass(
                "border transition-colors",
                "border-gray-300 text-indigo-600 focus:border-indigo-500 focus:ring-indigo-500",
                "border-gray-700 text-indigo-400 focus:border-indigo-400 focus:ring-indigo-400"
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
        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={name}
              className={darkModeClass(
                "font-medium",
                "text-gray-700",
                "text-gray-200"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={darkModeClass(
              "text-sm",
              "text-gray-500",
              "text-gray-400"
            )}>
              {description}
            </p>
          )}
        </div>
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

/* Example usage:
import { z } from 'zod';
import { Form } from './Form';

const feedbackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine(val => val, 'You must accept the terms'),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

function FeedbackForm() {
  const handleSubmit = async (data: FeedbackForm) => {
    // Handle form submission
  };

  return (
    <Form<FeedbackForm>
      schema={feedbackSchema}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {({ formState: { isSubmitting } }) => (
        <>
          <InputField
            name="title"
            label="Title"
            required
            disabled={isSubmitting}
          />
          
          <SelectField
            name="category"
            label="Category"
            required
            options={[
              { value: 'bug', label: 'Bug Report' },
              { value: 'feature', label: 'Feature Request' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select a category"
            disabled={isSubmitting}
          />
          
          <TextareaField
            name="message"
            label="Message"
            required
            rows={4}
            disabled={isSubmitting}
          />
          
          <CheckboxField
            name="terms"
            label="I agree to the terms"
            description="By submitting this form, you agree to our terms of service."
            disabled={isSubmitting}
          />
          
          <Button 
            type="submit" 
            isLoading={isSubmitting}
          >
            Submit Feedback
          </Button>
        </>
      )}
    </Form>
  );
}
*/