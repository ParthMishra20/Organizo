import { useEffect, useCallback, RefObject } from 'react';

interface UseFocusTrapOptions {
  initialFocus?: boolean;
  returnFocus?: boolean;
}

export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
) {
  const { initialFocus = true, returnFocus = true } = options;

  const trapFocus = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    // Save last focused element
    const lastFocusedElement = document.activeElement as HTMLElement;

    // Get all focusable elements
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element if initialFocus is true
    if (initialFocus && firstFocusableElement) {
      firstFocusableElement.focus();
    }

    // Handle tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // If shift + tab and first element is focused, move to last
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement?.focus();
        }
      } else {
        // If tab and last element is focused, move to first
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      // Return focus to last focused element
      if (returnFocus) {
        lastFocusedElement?.focus();
      }
    };
  }, [ref, initialFocus, returnFocus]);

  const releaseFocus = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    // Remove keydown listener
    element.removeEventListener('keydown', () => {});
  }, [ref]);

  useEffect(() => {
    const cleanup = trapFocus();
    return () => {
      cleanup?.();
      releaseFocus();
    };
  }, [trapFocus, releaseFocus]);

  return {
    trapFocus,
    releaseFocus,
  };
}

/* Example usage:
function Dialog({ isOpen }: { isOpen: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { trapFocus, releaseFocus } = useFocusTrap(dialogRef);

  useEffect(() => {
    if (isOpen) {
      trapFocus();
    } else {
      releaseFocus();
    }
  }, [isOpen, trapFocus, releaseFocus]);

  return (
    <div ref={dialogRef} tabIndex={-1}>
      <button>First focusable</button>
      <input type="text" />
      <button>Last focusable</button>
    </div>
  );
}
*/