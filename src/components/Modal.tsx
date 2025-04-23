import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useClickOutside } from '../hooks/useClickOutside';
import { combineAnimations, TRANSITIONS } from '../utils/animations';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  overlayClassName?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  maxWidth = 'md',
  className,
  overlayClassName,
}: ModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const { trapFocus, releaseFocus } = useFocusTrap(modalRef);

  // Handle escape key
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Handle click outside
  useClickOutside(modalRef, (event) => {
    if (closeOnOverlayClick) {
      onClose();
    }
  }, { enabled: isOpen });

  // Set up event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      trapFocus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      releaseFocus();
    };
  }, [isOpen, handleEscape, trapFocus, releaseFocus]);

  if (!isOpen) return null;

  const overlayClasses = combineAnimations(
    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
    TRANSITIONS.default,
    overlayClassName
  );

  const modalClasses = combineAnimations(
    "relative w-full mx-auto p-6 rounded-lg shadow-xl",
    "flex flex-col",
    maxWidthClasses[maxWidth],
    darkModeClass(
      "bg-background",
      "bg-white border border-gray-200",
      "bg-gray-900 border border-gray-800"
    ),
    TRANSITIONS.default,
    className
  );

  return createPortal(
    <div className={overlayClasses} aria-modal aria-hidden={false}>
      <div className="min-h-screen px-4 text-center">
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          ref={modalRef}
          className={modalClasses}
          role="dialog"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className={darkModeClass(
                "absolute top-4 right-4 p-1 rounded-full transition-colors",
                "text-gray-500 hover:bg-gray-100",
                "text-gray-400 hover:bg-gray-800"
              )}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}

          {/* Title */}
          {title && (
            <div
              id="modal-title"
              className="text-lg font-semibold mb-2"
            >
              {title}
            </div>
          )}

          {/* Description */}
          {description && (
            <div
              id="modal-description"
              className={darkModeClass(
                "text-sm mb-4",
                "text-gray-600",
                "text-gray-400"
              )}
            >
              {description}
            </div>
          )}

          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* Example usage:
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  maxWidth="sm"
>
  <div className="flex justify-end gap-2 mt-4">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>
*/