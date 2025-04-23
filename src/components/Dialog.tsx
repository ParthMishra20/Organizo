import React from 'react';
import Modal, { ModalProps } from './Modal';
import Button from './Button';
import { darkModeClass } from '../hooks/useDarkMode';
import { combineAnimations } from '../utils/animations';

interface DialogProps extends Omit<ModalProps, 'children'> {
  // Dialog specific props
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmVariant?: 'primary' | 'destructive';
  isConfirmLoading?: boolean;
  isCancelDisabled?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Dialog({
  // Dialog specific props
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  isConfirmLoading = false,
  isCancelDisabled = false,
  footer,
  children,
  // Modal props
  title,
  description,
  maxWidth = 'sm',
  ...modalProps
}: DialogProps) {
  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      modalProps.onClose();
    }
  };

  const contentClasses = combineAnimations(
    'space-y-4',
    darkModeClass(
      'text-foreground',
      'text-gray-600',
      'text-gray-300'
    )
  );

  return (
    <Modal
      title={title}
      description={description}
      maxWidth={maxWidth}
      {...modalProps}
    >
      {/* Content */}
      {children && (
        <div className={contentClasses}>
          {children}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        {footer || (
          <>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isCancelDisabled || isConfirmLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={isConfirmLoading}
            >
              {confirmText}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}

// Alert Dialog - For simple confirmations
interface AlertDialogProps extends Omit<DialogProps, 'children'> {
  message: React.ReactNode;
}

export function AlertDialog({ message, ...props }: AlertDialogProps) {
  return (
    <Dialog {...props}>
      <div className="text-center">{message}</div>
    </Dialog>
  );
}

// Form Dialog - For forms with submit handler
interface FormDialogProps extends Omit<DialogProps, 'onConfirm'> {
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function FormDialog({ 
  onSubmit, 
  isSubmitting = false,
  children,
  ...props 
}: FormDialogProps) {
  return (
    <Dialog
      {...props}
      isConfirmLoading={isSubmitting}
      onConfirm={undefined}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(e);
        }}
      >
        {children}
        <div className="sr-only">
          <button type="submit">Submit</button>
        </div>
      </form>
    </Dialog>
  );
}

/* Example usage:
// Basic Dialog
<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  description="Are you sure? This action cannot be undone."
  onConfirm={handleDelete}
  confirmText="Delete"
  confirmVariant="destructive"
/>

// Alert Dialog
<AlertDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Success"
  message="Your changes have been saved."
  confirmText="OK"
  onConfirm={() => setIsOpen(false)}
/>

// Form Dialog
<FormDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Item"
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
>
  <input type="text" name="name" required />
  <textarea name="description" />
</FormDialog>

// Custom Footer
<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Actions"
  footer={
    <div className="flex justify-between w-full">
      <Button variant="destructive">Delete</Button>
      <div className="flex gap-2">
        <Button variant="secondary">Save Draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </div>
  }
>
  <p>Dialog with custom footer actions</p>
</Dialog>
*/