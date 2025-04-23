import { useState, useEffect, useCallback } from 'react';

interface UseFloatingToolbarOptions {
  editorRef: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
}

interface UseFloatingToolbarReturn {
  isVisible: boolean;
  selection: Range | null;
  updateToolbar: () => void;
}

export function useFloatingToolbar({ 
  editorRef, 
  disabled 
}: UseFloatingToolbarOptions): UseFloatingToolbarReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [selection, setSelection] = useState<Range | null>(null);

  const updateToolbar = useCallback(() => {
    if (disabled) {
      setIsVisible(false);
      setSelection(null);
      return;
    }

    const sel = window.getSelection();
    const editor = editorRef.current;

    if (!sel || !editor) {
      setIsVisible(false);
      setSelection(null);
      return;
    }

    // Check if selection is within editor
    let node: Node | null = sel.anchorNode;
    let isWithinEditor = false;
    while (node) {
      if (node === editor) {
        isWithinEditor = true;
        break;
      }
      node = node.parentNode;
    }

    if (!isWithinEditor) {
      setIsVisible(false);
      setSelection(null);
      return;
    }

    // Show toolbar if text is selected
    const hasSelection = !sel.isCollapsed && sel.toString().trim().length > 0;
    if (hasSelection) {
      const range = sel.getRangeAt(0);
      setSelection(range);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setSelection(null);
    }
  }, [disabled, editorRef]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Create a debounced version of updateToolbar
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateToolbar, 100);
    };

    // Handle mouse and touch events
    const handleMouseUp = () => debouncedUpdate();
    const handleTouchEnd = () => debouncedUpdate();

    // Handle keyboard events
    const handleKeyUp = (e: KeyboardEvent) => {
      // Update on navigation keys and selection keys
      if (
        e.key.startsWith('Arrow') || 
        e.key === 'Home' || 
        e.key === 'End' || 
        e.shiftKey
      ) {
        debouncedUpdate();
      }
    };

    // Handle scroll events
    const handleScroll = () => {
      if (isVisible) {
        debouncedUpdate();
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (isVisible) {
        debouncedUpdate();
      }
    };

    // Hide toolbar when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (editor && !editor.contains(e.target as Node)) {
        setIsVisible(false);
        setSelection(null);
      }
    };

    // Add event listeners
    editor.addEventListener('mouseup', handleMouseUp);
    editor.addEventListener('touchend', handleTouchEnd);
    editor.addEventListener('keyup', handleKeyUp);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listeners on cleanup
    return () => {
      editor.removeEventListener('mouseup', handleMouseUp);
      editor.removeEventListener('touchend', handleTouchEnd);
      editor.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timeoutId);
    };
  }, [editorRef, isVisible, updateToolbar]);

  // Update toolbar when disabled state changes
  useEffect(() => {
    if (disabled) {
      setIsVisible(false);
      setSelection(null);
    }
  }, [disabled]);

  return {
    isVisible,
    selection,
    updateToolbar,
  };
}