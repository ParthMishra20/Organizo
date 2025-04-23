import React, { useEffect, useState } from 'react';
import { darkModeClass } from '../hooks/useDarkMode';
import LoadingSpinner from './LoadingSpinner';
import { 
  TRANSITIONS, 
  ANIMATIONS, 
  VARIANTS, 
  combineAnimations 
} from '../utils/animations';
import { useAnimation, getAnimationClasses } from '../hooks/useAnimation';

interface SplashScreenProps {
  onFinish?: () => void;
  minDisplayTime?: number;
}

export default function SplashScreen({ 
  onFinish, 
  minDisplayTime = 1500 
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const animation = useAnimation({
    initialVisible: true,
    duration: 500,
    onExited: onFinish
  });

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / minDisplayTime) * 100);
      
      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        animation.exit();
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [minDisplayTime, animation]);

  if (!animation.isVisible) return null;

  return (
    <div className={combineAnimations(
      darkModeClass(
        "fixed inset-0 flex items-center justify-center z-50",
        "bg-white",
        "bg-gray-900"
      ),
      TRANSITIONS.default,
      getAnimationClasses(animation.stage, {
        enter: VARIANTS.modal.overlay.enter,
        active: VARIANTS.modal.overlay.active,
        exit: VARIANTS.modal.overlay.exit
      })
    )}>
      <div className={combineAnimations(
        "text-center",
        TRANSITIONS.default,
        getAnimationClasses(animation.stage, {
          enter: VARIANTS.modal.content.enter,
          active: VARIANTS.modal.content.active,
          exit: VARIANTS.modal.content.exit
        })
      )}>
        <div className="mb-8">
          <img 
            src="/site logo.svg" 
            alt="Organizo" 
            className={combineAnimations(
              "w-24 h-24 mx-auto",
              ANIMATIONS.bounce
            )}
          />
          <h1 className={darkModeClass(
            "text-2xl font-bold mt-4 transition-colors",
            "text-gray-900",
            "text-white"
          )}>
            Organizo
          </h1>
        </div>

        <LoadingSpinner 
          size="lg" 
          progress={progress} 
          message={`Loading ${Math.round(progress)}%`}
        />

        <div className="mt-8 max-w-sm mx-auto">
          <p className={darkModeClass(
            "text-sm",
            "text-gray-600",
            "text-gray-400"
          )}>
            Your personal productivity companion
          </p>
        </div>
      </div>
    </div>
  );
}

interface InitialTransitionProps {
  children: React.ReactNode;
}

export function InitialTransition({ children }: InitialTransitionProps) {
  const animation = useAnimation({
    initialVisible: true,
    duration: 500,
    onExited: () => {
      // Ensure cleanup after animation is complete
      document.documentElement.classList.remove('loading');
    }
  });

  // Add loading class to prevent scrolling during splash screen
  useEffect(() => {
    document.documentElement.classList.add('loading');
    return () => {
      document.documentElement.classList.remove('loading');
    };
  }, []);

  return (
    <>
      {animation.isVisible && (
        <SplashScreen 
          onFinish={animation.exit}
          minDisplayTime={2000}
        />
      )}
      <div className={combineAnimations(
        TRANSITIONS.default,
        getAnimationClasses(animation.stage, {
          enter: VARIANTS.modal.content.enter,
          active: VARIANTS.modal.content.active,
          exit: ANIMATIONS.fadeOut,
        })
      )}>
        {!animation.isVisible ? null : children}
      </div>
    </>
  );
}