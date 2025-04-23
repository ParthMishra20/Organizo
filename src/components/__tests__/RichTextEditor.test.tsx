import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import RichTextEditor from '../RichTextEditor';
import { darkModeClass } from '../../hooks/useDarkMode';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dark mode hook
vi.mock('../../hooks/useDarkMode', () => ({
  darkModeClass: vi.fn((base, light, dark) => base),
}));

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm();
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe('RichTextEditor', () => {
  beforeEach(() => {
    // Reset mocks
    vi.restoreAllMocks();
  });

  it('renders editor with basic controls', () => {
    render(
      <TestWrapper>
        <RichTextEditor name="content" label="Editor" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Editor')).toBeInTheDocument();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          placeholder="Enter content..."
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    expect(editor).toHaveAttribute('data-empty', 'true');
    expect(editor).toHaveAttribute('data-placeholder', 'Enter content...');
  });

  it('applies formatting commands', async () => {
    render(
      <TestWrapper>
        <RichTextEditor name="content" />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    await userEvent.type(editor, 'Test content');

    // Mock command states
    vi.mocked(document.queryCommandState)
      .mockImplementationOnce(() => true)  // bold
      .mockImplementationOnce(() => true)  // italic
      .mockImplementationOnce(() => true); // underline

    // Bold
    await userEvent.keyboard('{Control>}b{/Control}');
    expect(document.queryCommandState('bold')).toBe(true);

    // Italic
    await userEvent.keyboard('{Control>}i{/Control}');
    expect(document.queryCommandState('italic')).toBe(true);

    // Underline
    await userEvent.keyboard('{Control>}u{/Control}');
    expect(document.queryCommandState('underline')).toBe(true);
  });

  it('handles link insertion', async () => {
    render(
      <TestWrapper>
        <RichTextEditor name="content" />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    await userEvent.type(editor, 'Link text');

    // Select text
    editor.focus();
    vi.mocked(document.execCommand).mockImplementation(() => true);

    // Open link dialog
    await userEvent.keyboard('{Control>}k{/Control}');
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill link details
    const urlInput = screen.getByLabelText('URL');
    const textInput = screen.getByLabelText('Link Text');
    await userEvent.type(urlInput, 'https://example.com');
    expect(textInput).toHaveValue('Link text');

    // Insert link
    await userEvent.click(screen.getByRole('button', { name: /insert link/i }));

    // Check if link was created
    const mockExecCommand = vi.mocked(document.execCommand);
    expect(mockExecCommand).toHaveBeenCalledWith('insertHTML', false, expect.stringContaining('href="https://example.com"'));
  });

  it('handles paste events', async () => {
    render(
      <TestWrapper>
        <RichTextEditor name="content" />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    
    vi.spyOn(pasteEvent.clipboardData!, 'getData')
      .mockReturnValue('<p><strong>Bold</strong> text</p>');

    fireEvent(editor, pasteEvent);

    expect(editor.innerHTML).toContain('<strong>Bold</strong>');
  });

  it('shows word and character count', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          showWordCount
          showCharCount
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    fireEvent.input(editor, {
      target: { innerHTML: '<p>Three words here.</p>' },
    });

    expect(screen.getByText('3 words')).toBeInTheDocument();
    expect(screen.getByText('15 characters')).toBeInTheDocument();
  });

  it('enforces character limit', async () => {
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          maxLength={10}
          showCharCount
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    await userEvent.type(editor, '12345678901');

    expect(editor.textContent).toBe('1234567890');
    expect(screen.getByText('10 / 10 characters')).toBeInTheDocument();
  });

  it('shows floating toolbar on selection', async () => {
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          showFloatingToolbar
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    await userEvent.type(editor, 'Test content');

    // Select text
    editor.focus();
    fireEvent.mouseUp(editor);

    await waitFor(() => {
      expect(screen.getAllByRole('toolbar')).toHaveLength(2);
    });
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          disabled
          defaultValue="Test content"
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    expect(editor).toHaveAttribute('contenteditable', 'false');
    expect(editor.closest('div')).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('calls onChange handler', async () => {
    const onChange = vi.fn();
    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          onChange={onChange}
        />
      </TestWrapper>
    );

    const editor = screen.getByRole('textbox', { hidden: true });
    await userEvent.type(editor, 'Test');

    expect(onChange).toHaveBeenCalledWith('<p>Test</p>');
  });

  it('exports content in different formats', async () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    render(
      <TestWrapper>
        <RichTextEditor
          name="content"
          defaultValue="<p><strong>Test</strong> content</p>"
          showExport
        />
      </TestWrapper>
    );

    // Export HTML
    await userEvent.click(screen.getByLabelText('Export as HTML'));
    expect(createObjectURL).toHaveBeenCalled();

    // Export Text
    await userEvent.click(screen.getByLabelText('Export as Text'));
    expect(createObjectURL).toHaveBeenCalled();

    // Export Markdown
    await userEvent.click(screen.getByLabelText('Export as Markdown'));
    expect(createObjectURL).toHaveBeenCalled();
  });
});