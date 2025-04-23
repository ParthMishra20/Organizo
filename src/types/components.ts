import { LucideIcon } from 'lucide-react';

export interface BaseProps {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithIcon {
  icon?: LucideIcon | React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface WithLoading {
  isLoading?: boolean;
  loadingText?: string;
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface WithSize {
  size?: Size;
}

export interface WithVariant<T> {
  variant?: T;
}

export interface WithActive {
  isActive?: boolean;
}

export interface WithDisabled {
  disabled?: boolean;
}

export interface WithFullWidth {
  fullWidth?: boolean;
}

export interface WithDarkMode {
  darkMode?: boolean;
}

export interface WithOnClick {
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface WithValue<T> {
  value?: T;
  onChange?: (value: T) => void;
}

export interface WithTooltip {
  /** Text to display in the tooltip */
  tooltip?: string;
  /** Position of the tooltip */
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
}

export interface WithRefProp<T> {
  /** Ref to the underlying element */
  ref?: React.Ref<T>;
}

// Common CSS class variants
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

// Button specific types
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// Layout specific types
export type Direction = 'horizontal' | 'vertical';
export type Alignment = 'start' | 'center' | 'end' | 'between' | 'around';
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common combinations
export type InteractiveProps = BaseProps & WithOnClick & WithDisabled;

export type ButtonBaseProps = 
  InteractiveProps & 
  WithChildren & 
  WithSize & 
  WithLoading & 
  WithFullWidth;

export type IconButtonProps = 
  ButtonBaseProps & 
  WithIcon;

export type InputBaseProps = 
  BaseProps & 
  WithSize & 
  WithDisabled;

export type SelectBaseProps<T> = 
  InputBaseProps & 
  WithValue<T>;

// Helper type for style variants
export type StyleVariants<T extends string> = Record<T, string>;

// Helper type for component sizes
export type SizeVariants<T extends Size> = Record<T, string>;

// Helper type for conditional classes
export type ConditionalClasses = Record<string, boolean>;

// Helper function to combine classes based on conditions
export function conditionalClasses(classes: ConditionalClasses): string {
  return Object.entries(classes)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
}