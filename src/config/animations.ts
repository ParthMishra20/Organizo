import { ANIMATION_DURATION } from './navigation';

export const TRANSITIONS = {
  default: `transition-all duration-${ANIMATION_DURATION.normal} ease-in-out`,
  fast: `transition-all duration-${ANIMATION_DURATION.fast} ease-in-out`,
  slow: `transition-all duration-${ANIMATION_DURATION.slow} ease-in-out`,
} as const;

export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideIn: 'animate-slideIn',
  slideOut: 'animate-slideOut',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
} as const;

export const TRANSFORMS = {
  scale: {
    enter: 'transform-gpu scale-95 opacity-0',
    active: 'transform-gpu scale-100 opacity-100',
    exit: 'transform-gpu scale-95 opacity-0',
  },
  slide: {
    enter: 'transform-gpu -translate-y-2 opacity-0',
    active: 'transform-gpu translate-y-0 opacity-100',
    exit: 'transform-gpu translate-y-2 opacity-0',
  },
} as const;

// Add these to your tailwind.config.js:
export const TAILWIND_ANIMATIONS = {
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideIn: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideOut: {
      '0%': { transform: 'translateY(0)', opacity: '1' },
      '100%': { transform: 'translateY(-10px)', opacity: '0' },
    },
  },
  animation: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    fadeOut: 'fadeOut 0.3s ease-in-out',
    slideIn: 'slideIn 0.3s ease-in-out',
    slideOut: 'slideOut 0.3s ease-in-out',
  },
};

// Helper function to combine animation classes
export function combineAnimations(...animations: string[]): string {
  return animations.filter(Boolean).join(' ');
}

// Helper function to create transition classes
export function createTransition(properties: string[], duration: keyof typeof ANIMATION_DURATION = 'normal'): string {
  return `transition-${properties.join(' ')} duration-${ANIMATION_DURATION[duration]} ease-in-out`;
}