import { ANIMATION_DURATION } from '../config/navigation';

export const TRANSITIONS = {
  default: `transition-all duration-${ANIMATION_DURATION.normal} ease-in-out`,
  fast: `transition-all duration-${ANIMATION_DURATION.fast} ease-out`,
  slow: `transition-all duration-${ANIMATION_DURATION.slow} ease-in-out`,
} as const;

export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideIn: 'animate-slideIn',
  slideOut: 'animate-slideOut',
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
} as const;

export const TRANSFORMS = {
  hover: {
    scale: 'hover:scale-102 active:scale-100',
    lift: 'hover:-translate-y-0.5 active:translate-y-0',
    glow: 'hover:shadow-lg hover:brightness-110',
  },
  enter: {
    fadeIn: 'opacity-0 transition-opacity duration-300',
    slideIn: 'opacity-0 -translate-y-2 transition-all duration-300',
    scaleIn: 'opacity-0 scale-95 transition-all duration-300',
  },
  active: {
    fadeIn: 'opacity-100',
    slideIn: 'opacity-100 translate-y-0',
    scaleIn: 'opacity-100 scale-100',
  },
  exit: {
    fadeOut: 'opacity-0 pointer-events-none',
    slideOut: 'opacity-0 translate-y-2 pointer-events-none',
    scaleOut: 'opacity-0 scale-95 pointer-events-none',
  },
} as const;

// Animation variants for different components
export const VARIANTS = {
  button: {
    default: `${TRANSITIONS.fast} ${TRANSFORMS.hover.scale}`,
    primary: `${TRANSITIONS.fast} ${TRANSFORMS.hover.scale} ${TRANSFORMS.hover.glow}`,
  },
  card: {
    default: `${TRANSITIONS.default} ${TRANSFORMS.hover.lift}`,
    interactive: `${TRANSITIONS.default} ${TRANSFORMS.hover.scale} ${TRANSFORMS.hover.glow}`,
  },
  menu: {
    item: `${TRANSITIONS.fast} ${TRANSFORMS.hover.scale}`,
    list: `${TRANSITIONS.default}`,
  },
  modal: {
    overlay: {
      enter: TRANSFORMS.enter.fadeIn,
      active: TRANSFORMS.active.fadeIn,
      exit: TRANSFORMS.exit.fadeOut,
    },
    content: {
      enter: TRANSFORMS.enter.scaleIn,
      active: TRANSFORMS.active.scaleIn,
      exit: TRANSFORMS.exit.scaleOut,
    },
  },
  toast: {
    enter: TRANSFORMS.enter.slideIn,
    active: TRANSFORMS.active.slideIn,
    exit: TRANSFORMS.exit.slideOut,
  },
} as const;

// Helper to combine animation classes
export function combineAnimations(...classes: (string | boolean | undefined)[]): string {
  return classes.filter((cls): cls is string => typeof cls === 'string' && Boolean(cls)).join(' ');
}

// Helper to get animation class based on stage
export function getStageAnimation(
  stage: string | null,
  animations: {
    enter?: string;
    active?: string;
    exit?: string;
  }
): string {
  switch (stage) {
    case 'enter':
      return animations.enter || '';
    case 'active':
      return animations.active || animations.enter || '';
    case 'exit':
      return animations.exit || '';
    default:
      return '';
  }
}

// Helper to create animation classes with timing
export function createAnimation(
  animation: keyof typeof ANIMATIONS,
  options?: {
    delay?: number;
    duration?: number;
    timing?: string;
  }
): string {
  const { delay = 0, duration = 300, timing = 'ease-out' } = options || {};
  return `${ANIMATIONS[animation]} ${duration}ms ${timing} ${delay}ms`;
}

// Helper to create transition classes
export function createTransition(
  properties: string[],
  duration: keyof typeof ANIMATION_DURATION = 'normal'
): string {
  return `transition-${properties.join(' ')} duration-${ANIMATION_DURATION[duration]} ease-in-out`;
}

/*
Example usage:

<button className={VARIANTS.button.primary}>
  Click me
</button>

<div className={combineAnimations(
  TRANSITIONS.default,
  TRANSFORMS.hover.scale,
  ANIMATIONS.fadeIn
)}>
  Content
</div>

<div className={createAnimation('fadeIn', { 
  delay: 200, 
  duration: 500 
})}>
  Delayed content
</div>
*/