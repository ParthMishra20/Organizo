import { useCallback, useEffect, useRef } from 'react';

interface UseMenuKeyboardOptions {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  focusFirst?: () => void;
  focusLast?: () => void;
}

export function useMenuKeyboard({
  isOpen = false,
  onClose,
  onOpen,
  focusFirst,
  focusLast
}: UseMenuKeyboardOptions = {}) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const menu = menuRef.current;
    if (!menu) return;

    // Get all focusable elements in the menu
    const focusableElements = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const currentFocusable = document.activeElement;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (currentFocusable === lastFocusable) {
          firstFocusable?.focus();
        } else {
          const currentIndex = Array.from(focusableElements).indexOf(currentFocusable as HTMLElement);
          focusableElements[currentIndex + 1]?.focus();
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (currentFocusable === firstFocusable) {
          lastFocusable?.focus();
        } else {
          const currentIndex = Array.from(focusableElements).indexOf(currentFocusable as HTMLElement);
          focusableElements[currentIndex - 1]?.focus();
        }
        break;

      case 'Home':
        event.preventDefault();
        firstFocusable?.focus();
        break;

      case 'End':
        event.preventDefault();
        lastFocusable?.focus();
        break;

      case 'Escape':
        event.preventDefault();
        onClose?.();
        break;

      case 'Enter':
      case ' ':
        if (!isOpen) {
          event.preventDefault();
          onOpen?.();
        }
        break;
    }
  }, [isOpen, onClose, onOpen]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    menu.addEventListener('keydown', handleKeyDown);
    return () => {
      menu.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return menuRef;
}

// Helper function to find next/previous focusable element
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
  );
}

// Helper function to focus first/last element
export function focusEdgeElement(container: HTMLElement, position: 'first' | 'last'): void {
  const elements = getFocusableElements(container);
  const elementToFocus = position === 'first' ? elements[0] : elements[elements.length - 1];
  elementToFocus?.focus();
}