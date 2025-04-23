import { useState, useEffect } from 'react';
import { ANIMATION_DURATION } from '../config/navigation';

interface TransitionOptions {
  duration?: number;
  onEnter?: () => void;
  onExit?: () => void;
}

interface TransitionState {
  isVisible: boolean;
  isAnimating: boolean;
  animationClass: string;
}

export function useTransition(
  isOpen: boolean,
  { 
    duration = ANIMATION_DURATION.normal,
    onEnter,
    onExit 
  }: TransitionOptions = {}
): TransitionState {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    let timeoutId: number;

    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      setAnimationClass('entering');
      onEnter?.();

      timeoutId = window.setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass('entered');
      }, duration);
    } else {
      setIsAnimating(true);
      setAnimationClass('exiting');
      onExit?.();

      timeoutId = window.setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        setAnimationClass('');
      }, duration);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, duration, onEnter, onExit]);

  return { isVisible, isAnimating, animationClass };
}

// Helper to combine transition classes
export function getTransitionClasses(
  baseClasses: string,
  { isVisible, isAnimating, animationClass }: TransitionState,
  states: {
    enter: string;
    entering?: string;
    entered?: string;
    exit: string;
    exiting?: string;
  }
): string {
  const classes = [baseClasses];

  if (!isVisible && !isAnimating) {
    classes.push(states.exit);
  } else if (animationClass === 'entering') {
    classes.push(states.entering || states.enter);
  } else if (animationClass === 'entered') {
    classes.push(states.entered || states.enter);
  } else if (animationClass === 'exiting') {
    classes.push(states.exiting || states.exit);
  }

  return classes.filter(Boolean).join(' ');
}

/*
Example usage:

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const transition = useTransition(isOpen, {
    duration: 300,
    onEnter: () => console.log('Entering...'),
    onExit: () => console.log('Exiting...')
  });

  const classes = getTransitionClasses(
    'base-classes',
    transition,
    {
      enter: 'opacity-100 translate-y-0',
      entering: 'opacity-0 translate-y-4',
      exit: 'opacity-0 translate-y-4',
      exiting: 'opacity-100 translate-y-0'
    }
  );

  if (!transition.isVisible) return null;

  return (
    <div className={classes}>
      Content
    </div>
  );
}
*/