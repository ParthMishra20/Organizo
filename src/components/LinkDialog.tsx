import React from 'react';
import { z } from 'zod';
import { Link } from 'lucide-react';
import Dialog from './Dialog';
import { FormInput } from './FormInput';
import { FormCheckbox } from './FormCheckbox';
import { FormLabel } from './FormElements';
import { useZodForm } from './Form';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LinkFormData) => void;
  initialValues?: Partial<LinkFormData>;
}

// Define form schema
const linkFormSchema = z.object({
  text: z.string().min(1, 'Link text is required'),
  url: z.string().url('Please enter a valid URL'),
  newTab: z.boolean().default(false),
});

// Infer form type from schema
export type LinkFormData = z.infer<typeof linkFormSchema>;

export default function LinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: LinkDialogProps) {
  const form = useZodForm(linkFormSchema, {
    defaultValues: {
      text: initialValues?.text || '',
      url: initialValues?.url || '',
      newTab: initialValues?.newTab || false,
    },
  });

  const handleSubmit = (data: LinkFormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Link"
      maxWidth="sm"
      onConfirm={form.handleSubmit(handleSubmit)}
      confirmText="Insert"
      confirmVariant="primary"
      isConfirmLoading={form.formState.isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <FormLabel htmlFor="text" required>
            Link Text
          </FormLabel>
          <FormInput
            id="text"
            placeholder="Enter link text"
            leftIcon={<Link className="h-4 w-4" />}
            error={form.formState.errors.text?.message}
            {...form.register('text')}
          />
        </div>

        <div>
          <FormLabel htmlFor="url" required>
            URL
          </FormLabel>
          <FormInput
            id="url"
            type="url"
            placeholder="https://example.com"
            error={form.formState.errors.url?.message}
            {...form.register('url')}
          />
        </div>

        <FormCheckbox
          label="Open in new tab"
          {...form.register('newTab')}
        />
      </div>
    </Dialog>
  );
}

/* Example usage:
function Editor() {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const handleInsertLink = () => {
    const text = window.getSelection()?.toString() || '';
    setSelectedText(text);
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = (data: LinkFormData) => {
    console.log('Link data:', data);
    // Insert link into editor
  };

  return (
    <div>
      <button onClick={handleInsertLink}>
        Insert Link
      </button>

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSubmit={handleLinkSubmit}
        initialValues={{
          text: selectedText,
        }}
      />
    </div>
  );
}
*/