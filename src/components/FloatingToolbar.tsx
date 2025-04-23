import React, { useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link,
  StrikethroughIcon,
  Superscript,
  Subscript,
} from 'lucide-react';
import IconButton from './IconButton';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';
import type { CommandType } from '../utils/editorUtils';

interface FloatingToolbarProps {
  onCommand: (command: CommandType, value?: any) => void;
  activeCommands: Record<string, boolean>;
  disabled?: boolean;
  className?: string;
}

const toolbarButtons = [
  { command: 'bold' as CommandType, icon: <Bold size={16} />, label: 'Bold' },
  { command: 'italic' as CommandType, icon: <Italic size={16} />, label: 'Italic' },
  { command: 'underline' as CommandType, icon: <Underline size={16} />, label: 'Underline' },
  { command: 'strikethrough' as CommandType, icon: <StrikethroughIcon size={16} />, label: 'Strikethrough' },
  { command: 'superscript' as CommandType, icon: <Superscript size={16} />, label: 'Superscript' },
  { command: 'subscript' as CommandType, icon: <Subscript size={16} />, label: 'Subscript' },
];

export default function FloatingToolbar({
  onCommand,
  activeCommands,
  disabled,
  className,
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const selection = window.getSelection();
      const toolbar = toolbarRef.current;

      if (!selection || !toolbar || selection.rangeCount === 0) {
        if (toolbar) {
          toolbar.style.display = 'none';
        }
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const isEmpty = selection.toString().trim().length === 0;

      if (isEmpty) {
        toolbar.style.display = 'none';
        return;
      }

      toolbar.style.display = 'flex';

      // Position toolbar above selection
      const toolbarRect = toolbar.getBoundingClientRect();
      const scrollY = window.scrollY;
      const top = rect.top - toolbarRect.height - 8 + scrollY;
      const left = rect.left + (rect.width - toolbarRect.width) / 2;

      // Keep toolbar within viewport
      const minLeft = 8;
      const maxLeft = window.innerWidth - toolbarRect.width - 8;
      const safeLeft = Math.min(Math.max(left, minLeft), maxLeft);

      toolbar.style.top = `${Math.max(top, scrollY + 8)}px`;
      toolbar.style.left = `${safeLeft}px`;
    };

    const handleSelectionChange = () => {
      if (disabled) return;
      requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      if (disabled) return;
      requestAnimationFrame(updatePosition);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [disabled]);

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Formatting options"
      className={cn(
        'fixed z-50 hidden items-center gap-0.5 p-1 rounded-lg shadow-lg',
        darkModeClass(
          'bg-background border border-input',
          'bg-white border-gray-200',
          'bg-gray-900 border-gray-700'
        ),
        'transform-gpu transition-all duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {toolbarButtons.map((button, index) => (
        <React.Fragment key={button.command}>
          <IconButton
            size="sm"
            icon={button.icon}
            onClick={() => onCommand(button.command)}
            isActive={activeCommands[button.command]}
            disabled={disabled}
            tooltip={button.label}
          />
          {index < toolbarButtons.length - 1 && (
            <div className="w-px h-4 bg-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}