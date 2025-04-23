import React, { useImperativeHandle } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRichTextEditor } from '../hooks/useRichTextEditor';
import RichTextToolbar from './RichTextToolbar';
import FloatingToolbar from './FloatingToolbar';
import LinkDialog from './LinkDialog';
import { darkModeClass } from '../hooks/useDarkMode';
import { cn } from '../utils/styles';
import type { CommandType } from '../utils/editorUtils';

export interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showWordCount?: boolean;
  showCharCount?: boolean;
  showFloatingToolbar?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (html: string) => void;
  className?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(({
  name,
  label,
  placeholder,
  error,
  hint,
  maxLength,
  showWordCount = false,
  showCharCount = false,
  showFloatingToolbar = true,
  disabled = false,
  defaultValue = '',
  onChange,
  className,
}, ref) => {
  const { register, setValue } = useFormContext();

  const editor = useRichTextEditor({
    defaultValue,
    maxLength,
    onChange: (html) => {
      setValue(name, html, { shouldValidate: true });
      onChange?.(html);
    },
  });

  // Register field with react-hook-form
  React.useEffect(() => {
    register(name);
  }, [register, name]);

  // Forward ref
  useImperativeHandle(ref, () => editor.editorRef.current!);

  const handleCommand = (command: CommandType, value?: any) => {
    if (!disabled) {
      editor.execCommand(command, value);
    }
  };

  return (
    <div className="space-y-2">
      {/* Editor container */}
      <div className="relative">
        {/* Toolbar */}
        <RichTextToolbar
          disabled={disabled}
          onCommand={handleCommand}
          activeCommands={editor.editorState.activeCommands}
          onLink={() => editor.linkDialog.isOpen}
        />

        {/* Editor */}
        <div
          ref={editor.editorRef}
          contentEditable={!disabled}
          className={cn(
            'rich-editor prose dark:prose-invert max-w-none',
            'min-h-[200px] p-4 rounded-md border focus:outline-none',
            disabled && 'opacity-60 cursor-not-allowed',
            error ? 'border-destructive' : darkModeClass(
              'border-input',
              'border-gray-300',
              'border-gray-700'
            ),
            className
          )}
          onInput={editor.handleChange}
          onKeyDown={editor.handleKeyDown}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          data-empty={editor.editorState.isEmpty}
          data-placeholder={placeholder}
          role="textbox"
          {...(disabled ? { 'aria-disabled': true } : {})}
        />

        {/* Floating Toolbar */}
        {showFloatingToolbar && !disabled && (
          <FloatingToolbar
            disabled={disabled}
            onCommand={handleCommand}
            activeCommands={editor.editorState.activeCommands}
          />
        )}
      </div>

      {/* Word and Character Count */}
      {(showWordCount || showCharCount) && (
        <div className="flex justify-end space-x-4 text-sm text-muted-foreground">
          {showWordCount && (
            <span>{editor.editorState.wordCount} words</span>
          )}
          {showCharCount && (
            <span>
              {editor.editorState.charCount}
              {maxLength ? ` / ${maxLength}` : ''} characters
            </span>
          )}
        </div>
      )}

      {/* Link Dialog */}
      <LinkDialog
        isOpen={editor.linkDialog.isOpen}
        onClose={editor.linkDialog.onClose}
        onSubmit={editor.linkDialog.onSubmit}
        initialValues={editor.linkDialog.initialValues}
      />

      {/* Error or Hint */}
      {(error || hint) && (
        <p
          id={error ? `${name}-error` : `${name}-hint`}
          className={cn(
            'text-sm',
            error ? 'text-destructive' : darkModeClass(
              'text-muted-foreground',
              'text-gray-500',
              'text-gray-400'
            )
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
export type { RichTextEditorProps };

/* Example usage:
function FormWithEditor() {
  const form = useForm();

  return (
    <form>
      <RichTextEditor
        name="content"
        label="Content"
        placeholder="Start typing..."
        maxLength={1000}
        showWordCount
        showCharCount
      />
    </form>
  );
}
*/