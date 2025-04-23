import React from 'react';
import { Loader2 } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { combineAnimations, TRANSITIONS } from '../utils/animations';
import { Tooltip } from './Tooltip';

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
};

const sizes = {
  sm: "p-1",
  md: "p-2",
  lg: "p-3",
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  tooltipDelay?: number;
  tooltipOffset?: number;
  isActive?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  tooltip,
  tooltipPlacement = 'top',
  tooltipDelay = 0,
  tooltipOffset = 8,
  isActive = false,
  className,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const classes = combineAnimations(
    // Base styles
    "inline-flex items-center justify-center rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
    "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    TRANSITIONS.default,

    // Variant
    variants[variant],

    // Size
    sizes[size],

    // Active state
    isActive && darkModeClass(
      "bg-primary text-primary-foreground",
      "bg-primary-600 text-white",
      "bg-primary-500 text-white"
    ),

    // Custom classes
    className
  );

  const button = (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
    </button>
  );

  if (tooltip && !disabled && !isLoading) {
    return (
      <Tooltip
        content={tooltip}
        placement={tooltipPlacement}
        delayMs={tooltipDelay}
        offset={tooltipOffset}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
});

IconButton.displayName = 'IconButton';

export default IconButton;

/* Example usage:
import { Mail, Trash, Settings } from 'lucide-react';

<IconButton
  icon={<Mail size={20} />}
  tooltip="Send email"
/>

<IconButton
  icon={<Settings size={20} />}
  variant="secondary"
  size="lg"
  tooltip="Settings"
  tooltipPlacement="right"
/>

<IconButton
  icon={<Trash size={20} />}
  variant="destructive"
  tooltip="Delete"
  isLoading={isDeleting}
/>

<IconButton
  icon={<Heart size={20} />}
  isActive={isLiked}
  onClick={toggleLike}
  tooltip={isLiked ? "Unlike" : "Like"}
/>
*/