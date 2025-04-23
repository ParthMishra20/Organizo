import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  execCommand, 
  CommandType,
  editorCommands,
  getActiveCommands,
  getWordCount,
  getCharacterCount,
  cleanHtml,
  sanitizeHtml,
} from '../utils/editorUtils';
import type { LinkFormData } from '../components/LinkDialog';

interface UseRichTextEditorProps {
  name?: string;
  onChange?: (html: string) => void;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  defaultValue?: string;
}

interface EditorState {
  isEmpty: boolean;
  wordCount: number;
  charCount: number;
  activeCommands: ReturnType<typeof getActiveCommands>;
}

export function useRichTextEditor({
  name,
  onChange,
  onChangeText,
  maxLength,
  defaultValue = '',
}: UseRichTextEditorProps = {}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Range | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    isEmpty: true,
    wordCount: 0,
    charCount: 0,
    activeCommands: getActiveCommands(),
  });

  // Handle commands
  const execCommand = useCallback((command: CommandType, value?: any) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const success = editorCommands[command](value);
      if (success) {
        setEditorState(prev => ({
          ...prev,
          activeCommands: getActiveCommands(),
        }));
        handleChange();
      }
    }
  }, []);

  // Handle changes
  const handleChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.textContent || '';

      // Handle max length
      if (maxLength && text.length > maxLength) {
        editorRef.current.innerHTML = html.substring(0, maxLength);
        return;
      }

      // Clean HTML
      const cleanContent = cleanHtml(html);
      editorRef.current.innerHTML = cleanContent;

      // Update state
      setEditorState({
        isEmpty: text.trim().length === 0,
        wordCount: getWordCount(text),
        charCount: getCharacterCount(text),
        activeCommands: getActiveCommands(),
      });

      // Notify changes
      onChange?.(cleanContent);
      onChangeText?.(text);
    }
  }, [onChange, onChangeText, maxLength]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }, [execCommand]);

  // Link handling
  const [linkDialog, setLinkDialog] = useState({
    isOpen: false,
    initialValues: {
      text: '',
      url: '',
      newTab: false,
    },
  });

  const handleInsertLink = useCallback((data: LinkFormData) => {
    const { text, url, newTab } = data;
    
    if (editorRef.current) {
      // Restore selection
      const sel = window.getSelection();
      sel?.removeAllRanges();
      if (selection) {
        sel?.addRange(selection);
      }

      // Create link HTML
      const linkHtml = `<a href="${url}"${newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;

      // Insert link
      execCommand('insertHTML', linkHtml);
    }

    // Reset selection and close dialog
    setSelection(null);
    setLinkDialog(prev => ({ ...prev, isOpen: false }));
  }, [selection, execCommand]);

  const openLinkDialog = useCallback(() => {
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    const text = range?.toString() || '';
    let url = '';
    let newTab = false;

    // Check if selection is inside a link
    const linkNode = range?.commonAncestorContainer.parentElement;
    if (linkNode?.tagName === 'A') {
      url = linkNode.getAttribute('href') || '';
      newTab = linkNode.getAttribute('target') === '_blank';
    }

    // Save selection
    if (range) {
      setSelection(range.cloneRange());
    }

    // Open dialog
    setLinkDialog({
      isOpen: true,
      initialValues: {
        text,
        url,
        newTab,
      },
    });
  }, []);

  // Set default value
  useEffect(() => {
    if (defaultValue && editorRef.current) {
      const safeContent = sanitizeHtml(defaultValue);
      editorRef.current.innerHTML = safeContent;
      handleChange();
    }
  }, [defaultValue, handleChange]);

  return {
    editorRef,
    editorState,
    handleChange,
    handleKeyDown,
    execCommand,
    linkDialog: {
      isOpen: linkDialog.isOpen,
      initialValues: linkDialog.initialValues,
      onSubmit: handleInsertLink,
      onClose: () => setLinkDialog(prev => ({ ...prev, isOpen: false })),
    },
  };
}

/* Example usage:
function RichTextEditor() {
  const editor = useRichTextEditor({
    onChange: (html) => console.log('HTML:', html),
    onChangeText: (text) => console.log('Text:', text),
    maxLength: 1000,
    defaultValue: '<p>Initial content</p>',
  });

  return (
    <div>
      <RichTextToolbar
        onCommand={editor.execCommand}
        activeCommands={editor.editorState.activeCommands}
        onLink={() => editor.linkDialog.isOpen}
      />

      <div
        ref={editor.editorRef}
        contentEditable
        className="rich-editor"
        onInput={editor.handleChange}
        onKeyDown={editor.handleKeyDown}
        data-empty={editor.editorState.isEmpty}
      />

      <div>
        Words: {editor.editorState.wordCount}
        Characters: {editor.editorState.charCount}
      </div>

      <LinkDialog
        isOpen={editor.linkDialog.isOpen}
        onClose={editor.linkDialog.onClose}
        onSubmit={editor.linkDialog.onSubmit}
        initialValues={editor.linkDialog.initialValues}
      />
    </div>
  );
}
*/