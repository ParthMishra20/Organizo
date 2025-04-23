import React from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, 
  AlignLeft, AlignCenter, AlignRight, Quote, Code,
  Heading1, Heading2, Heading3, Download, FileText, FileCode
} from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import IconButton from './IconButton';
import { exportContent, type ExportFormat } from '../utils/richText';

export interface ToolbarButton {
  icon: React.ReactNode;
  command: string;
  label: string;
  shortcut?: string;
  arg?: string;
  group?: string;
}

interface RichTextToolbarProps {
  onCommand: (command: string, arg?: string) => void;
  activeCommands: Record<string, boolean>;
  content: string;
  disabled?: boolean;
  showExport?: boolean;
}

const TOOLBAR_BUTTONS: (ToolbarButton | null)[] = [
  { 
    icon: <Bold size={16} />, 
    command: 'bold', 
    label: 'Bold', 
    shortcut: '⌘B',
    group: 'format'
  },
  { 
    icon: <Italic size={16} />, 
    command: 'italic', 
    label: 'Italic', 
    shortcut: '⌘I',
    group: 'format'
  },
  { 
    icon: <Underline size={16} />, 
    command: 'underline', 
    label: 'Underline', 
    shortcut: '⌘U',
    group: 'format'
  },
  null, // Divider
  { 
    icon: <Heading1 size={16} />, 
    command: 'formatBlock', 
    label: 'Heading 1', 
    arg: '<h1>',
    group: 'heading'
  },
  { 
    icon: <Heading2 size={16} />, 
    command: 'formatBlock', 
    label: 'Heading 2', 
    arg: '<h2>',
    group: 'heading'
  },
  { 
    icon: <Heading3 size={16} />, 
    command: 'formatBlock', 
    label: 'Heading 3', 
    arg: '<h3>',
    group: 'heading'
  },
  null, // Divider
  { 
    icon: <List size={16} />, 
    command: 'insertUnorderedList', 
    label: 'Bullet List',
    group: 'list'
  },
  { 
    icon: <ListOrdered size={16} />, 
    command: 'insertOrderedList', 
    label: 'Numbered List',
    group: 'list'
  },
  null, // Divider
  { 
    icon: <AlignLeft size={16} />, 
    command: 'justifyLeft', 
    label: 'Align Left',
    group: 'align'
  },
  { 
    icon: <AlignCenter size={16} />, 
    command: 'justifyCenter', 
    label: 'Align Center',
    group: 'align'
  },
  { 
    icon: <AlignRight size={16} />, 
    command: 'justifyRight', 
    label: 'Align Right',
    group: 'align'
  },
  null, // Divider
  { 
    icon: <Quote size={16} />, 
    command: 'formatBlock', 
    label: 'Quote',
    arg: '<blockquote>',
    group: 'block'
  },
  { 
    icon: <Code size={16} />, 
    command: 'formatBlock', 
    label: 'Code Block',
    arg: '<pre>',
    group: 'block'
  },
  { 
    icon: <LinkIcon size={16} />, 
    command: 'createLink', 
    label: 'Insert Link',
    shortcut: '⌘K',
    group: 'insert'
  },
];

const EXPORT_BUTTONS: Array<{
  icon: React.ReactNode;
  label: string;
  format: ExportFormat;
}> = [
  {
    icon: <FileText size={16} />,
    label: 'Export as Text',
    format: 'txt'
  },
  {
    icon: <FileCode size={16} />,
    label: 'Export as HTML',
    format: 'html'
  },
  {
    icon: <Download size={16} />,
    label: 'Export as Markdown',
    format: 'md'
  }
];

export default function RichTextToolbar({
  onCommand,
  activeCommands,
  content,
  disabled,
  showExport = true
}: RichTextToolbarProps) {
  const handleExport = (format: ExportFormat) => {
    exportContent(content, {
      format,
      filename: `document-${new Date().toISOString().split('T')[0]}`,
      includeMeta: true
    });
  };

  return (
    <div className={darkModeClass(
      "flex flex-wrap items-center gap-1 p-2 border-b",
      "border-gray-200 bg-gray-50",
      "border-gray-700 bg-gray-900"
    )}>
      {/* Format Buttons */}
      {TOOLBAR_BUTTONS.map((button, index) => (
        button ? (
          <IconButton
            key={index}
            icon={button.icon}
            onClick={() => onCommand(button.command, button.arg)}
            aria-label={button.label}
            disabled={disabled}
            variant={activeCommands[button.command + (button.arg || '')] ? 'primary' : 'ghost'}
            size="sm"
            tooltip={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            className="editor-toolbar-button"
            data-active={activeCommands[button.command + (button.arg || '')]}
          />
        ) : (
          <div key={index} className="editor-toolbar-divider" />
        )
      ))}

      {/* Export Buttons */}
      {showExport && (
        <>
          <div className="editor-toolbar-divider" />
          {EXPORT_BUTTONS.map((button, index) => (
            <IconButton
              key={index}
              icon={button.icon}
              onClick={() => handleExport(button.format)}
              aria-label={button.label}
              disabled={disabled || !content}
              variant="ghost"
              size="sm"
              tooltip={button.label}
            />
          ))}
        </>
      )}
    </div>
  );
}