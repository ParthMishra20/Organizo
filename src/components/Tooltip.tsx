import React, { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { darkModeClass } from '../hooks/useDarkMode';
import { useClickOutside } from '../hooks/useClickOutside';
import { combineAnimations, TRANSITIONS } from '../utils/animations';

interface Position {
  top: number;
  left: number;
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delayMs?: number;
  offset?: number;
  maxWidth?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delayMs = 0,
  offset = 8,
  maxWidth = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  useClickOutside([triggerRef, tooltipRef], hideTooltip, {
    enabled: isVisible,
  });

  const showTooltip = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let top = 0;
        let left = 0;

        switch (placement) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - offset;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'right':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.right + offset;
            break;
          case 'bottom':
            top = triggerRect.bottom + offset;
            left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'left':
            top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            left = triggerRect.left - tooltipRect.width - offset;
            break;
        }

        // Keep tooltip within viewport
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        if (left < 8) left = 8;
        if (left + tooltipRect.width > viewport.width - 8) {
          left = viewport.width - tooltipRect.width - 8;
        }
        if (top < 8) top = 8;
        if (top + tooltipRect.height > viewport.height - 8) {
          top = viewport.height - tooltipRect.height - 8;
        }

        // Add scroll offset
        top += window.scrollY;
        left += window.scrollX;

        setPosition({ top, left });
        setIsVisible(true);
      }
    }, delayMs);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipClasses = combineAnimations(
    "absolute z-50 px-2 py-1 text-sm rounded-md shadow-lg max-w-xs",
    darkModeClass(
      "bg-gray-900 text-white",
      "bg-gray-900 text-white",
      "bg-gray-100 text-gray-900"
    ),
    TRANSITIONS.fast,
    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
    "transform-gpu",
    className
  );

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      })}
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={tooltipClasses}
          style={{
            ...position,
            maxWidth,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

/* Example usage:
<Tooltip content="Delete item" placement="right">
  <button>🗑️</button>
</Tooltip>

<Tooltip 
  content="This is a longer tooltip that explains something in detail"
  placement="bottom"
  delayMs={500}
  maxWidth={300}
>
  <InfoIcon />
</Tooltip>
*/