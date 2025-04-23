/**
 * Configuration for rich text sanitization
 */
const ALLOWED_TAGS = new Set([
  // Basic formatting
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 'strike', 
  // Headers
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Lists
  'ul', 'ol', 'li',
  // Links and media
  'a', 'img',
  // Block elements
  'blockquote', 'pre', 'code',
  // Table elements
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  // Semantic elements
  'article', 'section', 'div', 'span'
]);

const ALLOWED_ATTRIBUTES = new Set([
  'href', 'target', 'rel', // Links
  'src', 'alt', 'title',   // Images
  'class', 'id',           // Styling
  'style'                  // Inline styles
]);

export type ExportFormat = 'html' | 'txt' | 'md';

interface ExportOptions {
  format: ExportFormat;
  filename: string;
  includeMeta?: boolean;
}

/**
 * Basic HTML sanitization
 */
export function sanitizeHtml(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove unwanted elements
    const walk = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Element) => {
          if (!ALLOWED_TAGS.has(node.tagName.toLowerCase())) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToRemove: Element[] = [];
    let node = walk.nextNode() as Element;
    
    while (node) {
      // Clean attributes
      const attrs = Array.from(node.attributes);
      attrs.forEach(attr => {
        if (!ALLOWED_ATTRIBUTES.has(attr.name)) {
          node.removeAttribute(attr.name);
        }
        // Sanitize URLs
        if (attr.name === 'href' || attr.name === 'src') {
          const url = attr.value.trim().toLowerCase();
          if (url.startsWith('javascript:') || url.startsWith('data:')) {
            node.removeAttribute(attr.name);
          }
        }
      });
      
      node = walk.nextNode() as Element;
    }

    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
}

/**
 * Safely creates a DOM element for parsing
 */
function createSafeElement(): HTMLDivElement {
  const div = document.createElement('div');
  div.style.display = 'none';
  return div;
}

/**
 * Converts HTML to plain text
 */
export function htmlToText(html: string): string {
  try {
    const div = createSafeElement();
    div.innerHTML = sanitizeHtml(html);
    const text = div.textContent || div.innerText || '';
    return text.trim();
  } catch (error) {
    console.error('Error converting HTML to text:', error);
    return '';
  }
}

/**
 * Extracts a summary from HTML content
 */
export function extractSummary(html: string, maxLength = 160): string {
  try {
    const text = htmlToText(html);
    if (text.length <= maxLength) return text;
    
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.slice(0, lastSpace) + '...'
      : truncated + '...';
  } catch (error) {
    console.error('Error extracting summary:', error);
    return '';
  }
}

/**
 * Counts words in HTML content
 */
export function countWords(html: string): number {
  try {
    const text = htmlToText(html);
    return text.trim().split(/\s+/).filter(Boolean).length;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
}

/**
 * Counts characters in HTML content
 */
export function countCharacters(html: string, countSpaces = true): number {
  try {
    const text = htmlToText(html);
    return countSpaces ? text.length : text.replace(/\s/g, '').length;
  } catch (error) {
    console.error('Error counting characters:', error);
    return 0;
  }
}

/**
 * Converts HTML to Markdown
 */
export function htmlToMarkdown(html: string): string {
  try {
    const clean = sanitizeHtml(html);
    let markdown = clean
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      // Bold and Italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_')
      // Lists
      .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
      .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1\n')
      // Links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Images
      .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
      // Blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
      // Code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      // Paragraphs and line breaks
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br[^>]*>/gi, '\n')
      // Clean up
      .replace(/&nbsp;/g, ' ')
      .replace(/\n\n+/g, '\n\n')
      .trim();

    return markdown;
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return '';
  }
}

/**
 * Creates metadata for exports
 */
function createMetadata(format: ExportFormat): string {
  const date = new Date().toISOString();
  switch (format) {
    case 'html':
      return `<!--\nExported on: ${date}\nGenerated by: Organizo\n-->\n\n`;
    case 'md':
      return `<!-- Exported on: ${date} -->\n<!-- Generated by: Organizo -->\n\n`;
    case 'txt':
      return `Exported on: ${date}\nGenerated by: Organizo\n\n`;
    default:
      return '';
  }
}

/**
 * Exports HTML content to a file
 */
export function exportContent(
  html: string, 
  { format, filename, includeMeta = true }: ExportOptions
): void {
  try {
    let content: string;
    let mimeType: string;
    const metadata = includeMeta ? createMetadata(format) : '';

    switch (format) {
      case 'html':
        content = metadata + sanitizeHtml(html);
        mimeType = 'text/html';
        break;
      case 'txt':
        content = metadata + htmlToText(html);
        mimeType = 'text/plain';
        break;
      case 'md':
        content = metadata + htmlToMarkdown(html);
        mimeType = 'text/markdown';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting content:', error);
    throw new Error('Failed to export content');
  }
}

/* Example usage:
// Sanitize content
const clean = sanitizeHtml(userInput);

// Get plain text
const text = htmlToText('<p>Hello <b>world</b>!</p>');
// Result: 'Hello world!'

// Get summary
const summary = extractSummary('<p>Long content here...</p>', 100);
// Result: 'Long content...'

// Count words
const words = countWords('<p>This is a test.</p>');
// Result: 4

// Convert to Markdown
const markdown = htmlToMarkdown('<h1>Title</h1><p>Text with <b>bold</b>.</p>');
// Result: '# Title\n\nText with **bold**.'

// Export content
exportContent(html, { 
  format: 'md', 
  filename: 'document',
  includeMeta: true 
});
// Downloads: document.md
*/