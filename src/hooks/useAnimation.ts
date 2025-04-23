import { useState, useCallback, useEffect, useRef } from 'react';
import { ANIMATION_DURATION } from '../config/navigation';

interface AnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  stage: 'enter' | 'active' | 'exit' | null;
}

interface UseAnimationOptions {
  initialVisible?: boolean;
  duration?: number;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}

export function useAnimation({
  initialVisible = false,
  duration = ANIMATION_DURATION.normal,
  onEnter,
  onEntered,
  onExit,
  onExited,
}: UseAnimationOptions = {}) {
  const [state, setState] = useState<AnimationState>({
    isVisible: initialVisible,
    isAnimating: false,
    stage: initialVisible ? 'active' : null,
  });

  const timeoutRef = useRef<number>();

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => clearTimeout();
  }, [clearTimeout]);

  const enter = useCallback(() => {
    clearTimeout();
    setState(prev => ({
      ...prev,
      isVisible: true,
      isAnimating: true,
      stage: 'enter',
    }));
    onEnter?.();

    timeoutRef.current = window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        isAnimating: false,
        stage: 'active',
      }));
      onEntered?.();
    }, duration);
  }, [clearTimeout, duration, onEnter, onEntered]);

  const exit = useCallback(() => {
    clearTimeout();
    setState(prev => ({
      ...prev,
      isAnimating: true,
      stage: 'exit',
    }));
    onExit?.();

    timeoutRef.current = window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        isVisible: false,
        isAnimating: false,
        stage: null,
      }));
      onExited?.();
    }, duration);
  }, [clearTimeout, duration, onExit, onExited]);

  const toggle = useCallback(() => {
    if (state.isVisible) {
      exit();
    } else {
      enter();
    }
  }, [state.isVisible, enter, exit]);

  return {
    ...state,
    enter,
    exit,
    toggle,
  } as const;
}

/*
Example usage:

function MyComponent() {
  const animation = useAnimation({
    duration: 300,
    onEntered: () => console.log('Animation completed'),
  });

  return (
    <>
      <button onClick={animation.toggle}>
        Toggle Content
      </button>

      {animation.isVisible && (
        <div className={combineAnimations(
          TRANSITIONS.default,
          animation.stage === 'enter' && TRANSFORMS.enter.fadeIn,
          animation.stage === 'active' && TRANSFORMS.active.fadeIn,
          animation.stage === 'exit' && TRANSFORMS.exit.fadeOut,
        )}>
          Animated Content
        </div>
      )}
    </>
  );
}
*/

// Helper to create animation state classes
export function getAnimationClasses(
  stage: AnimationState['stage'],
  variants: {
    enter: string;
    active: string;
    exit: string;
  }
): string {
  switch (stage) {
    case 'enter':
      return variants.enter;
    case 'active':
      return variants.active;
    case 'exit':
      return variants.exit;
    default:
      return '';
  }
}