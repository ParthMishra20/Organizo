// Command types
export type CommandType = 
  | 'bold' 
  | 'italic' 
  | 'underline'
  | 'strikethrough'
  | 'subscript'
  | 'superscript'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'formatBlock'
  | 'removeFormat'
  | 'insertHTML';

// Document commands wrapper
export const execCommand = (command: CommandType, showUI = false, value: any = null): boolean => {
  try {
    return document.execCommand(command, showUI, value);
  } catch (error) {
    console.error(`Error executing command ${command}:`, error);
    return false;
  }
};

// Query command state wrapper
export const queryCommandState = (command: CommandType): boolean => {
  try {
    return document.queryCommandState(command);
  } catch (error) {
    console.error(`Error querying command state ${command}:`, error);
    return false;
  }
};

// Query command value wrapper
export const queryCommandValue = (command: CommandType): string => {
  try {
    return document.queryCommandValue(command);
  } catch (error) {
    console.error(`Error querying command value ${command}:`, error);
    return '';
  }
};

// Get word count
export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Get character count
export const getCharacterCount = (text: string): number => {
  return text.length;
};

// Format block options
export const formatBlockOptions = {
  paragraph: 'p',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  blockquote: 'blockquote',
  preformatted: 'pre',
};

// Editor commands
export const editorCommands = {
  bold: () => execCommand('bold'),
  italic: () => execCommand('italic'),
  underline: () => execCommand('underline'),
  strikethrough: () => execCommand('strikethrough'),
  subscript: () => execCommand('subscript'),
  superscript: () => execCommand('superscript'),
  alignLeft: () => execCommand('justifyLeft'),
  alignCenter: () => execCommand('justifyCenter'),
  alignRight: () => execCommand('justifyRight'),
  bulletList: () => execCommand('insertUnorderedList'),
  numberList: () => execCommand('insertOrderedList'),
  formatBlock: (type: keyof typeof formatBlockOptions) => 
    execCommand('formatBlock', false, `<${formatBlockOptions[type]}>`),
  removeFormat: () => execCommand('removeFormat'),
};

// Get active commands state
export const getActiveCommands = () => ({
  bold: queryCommandState('bold'),
  italic: queryCommandState('italic'),
  underline: queryCommandState('underline'),
  strikethrough: queryCommandState('strikethrough'),
  subscript: queryCommandState('subscript'),
  superscript: queryCommandState('superscript'),
  bulletList: queryCommandState('insertUnorderedList'),
  numberList: queryCommandState('insertOrderedList'),
  alignLeft: queryCommandState('justifyLeft'),
  alignCenter: queryCommandState('justifyCenter'),
  alignRight: queryCommandState('justifyRight'),
});

// Clean HTML content
export const cleanHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Remove empty paragraphs
  const emptyParagraphs = div.querySelectorAll('p:empty');
  emptyParagraphs.forEach(p => p.remove());

  // Remove unwanted attributes
  const elements = div.querySelectorAll('*');
  elements.forEach(el => {
    // Keep only essential attributes
    const allowedAttributes = ['href', 'target', 'rel'];
    Array.from(el.attributes).forEach(attr => {
      if (!allowedAttributes.includes(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
};

// Sanitize HTML for safe display
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Remove all script tags
  const scripts = div.getElementsByTagName('script');
  while (scripts[0]) scripts[0].parentNode?.removeChild(scripts[0]);

  // Remove on* attributes
  const elements = div.querySelectorAll('*');
  elements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
};

/* Example usage:
// Execute commands
editorCommands.bold();
editorCommands.formatBlock('heading1');

// Get active states
const activeCommands = getActiveCommands();
console.log('Bold is active:', activeCommands.bold);

// Clean content
const cleanContent = cleanHtml(editorContent);
const safeContent = sanitizeHtml(userInput);

// Get counts
const wordCount = getWordCount(text);
const charCount = getCharacterCount(text);
*/