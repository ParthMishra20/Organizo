import React from 'react';
import { Loader2 } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { combineAnimations, TRANSITIONS } from '../utils/animations';

const variants = {
  primary: darkModeClass(
    "bg-primary text-primary-foreground hover:bg-primary/90",
    "bg-primary-600 text-white hover:bg-primary-700",
    "bg-primary-500 text-white hover:bg-primary-600"
  ),
  secondary: darkModeClass(
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    "bg-gray-200 text-gray-900 hover:bg-gray-300",
    "bg-gray-700 text-gray-100 hover:bg-gray-600"
  ),
  outline: darkModeClass(
    "border-2 bg-transparent hover:bg-accent/10",
    "border-gray-200 text-gray-700 hover:bg-gray-100",
    "border-gray-600 text-gray-300 hover:bg-gray-800"
  ),
  ghost: darkModeClass(
    "hover:bg-accent hover:text-accent-foreground",
    "hover:bg-gray-100 text-gray-700",
    "hover:bg-gray-800 text-gray-300"
  ),
  destructive: darkModeClass(
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    "bg-red-600 text-white hover:bg-red-700",
    "bg-red-500 text-white hover:bg-red-600"
  ),
  link: darkModeClass(
    "underline-offset-4 hover:underline text-primary",
    "text-primary-600",
    "text-primary-400"
  ),
};

const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  icon: "p-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const classes = combineAnimations(
    // Base styles
    "inline-flex items-center justify-center font-medium",
    "rounded-md select-none",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
    "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    TRANSITIONS.default,

    // Variant
    variants[variant],

    // Size
    sizes[size],

    // Full width
    fullWidth && "w-full",

    // Custom classes
    className
  );

  const content = (
    <>
      {isLoading && (
        <Loader2
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      {!isLoading && leftIcon && (
        <span className="mr-2" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {isLoading ? loadingText || children : children}
      {!isLoading && rightIcon && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

/* Example usage:
<Button>Default Button</Button>
<Button variant="secondary" size="sm">Small Secondary</Button>
<Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
<Button isLoading loadingText="Saving...">Submit</Button>
<Button variant="destructive" fullWidth>Delete</Button>
<Button variant="link">Link Style</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
*/