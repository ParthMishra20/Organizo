import { useState, useCallback } from 'react';
import type { ModalProps, ModalType } from '../components/Modal';

export interface ModalState {
  isOpen: boolean;
  type?: ModalType;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  content?: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
}

export interface UseModalReturn {
  modalProps: Omit<ModalProps, 'children'>;
  openModal: (state: Partial<ModalState>) => void;
  closeModal: () => void;
  updateModal: (state: Partial<ModalState>) => void;
  setConfirmLoading: (loading: boolean) => void;
  setConfirmDisabled: (disabled: boolean) => void;
  confirm: () => void | Promise<void>;
  cancel: () => void;
}

export interface UseModalOptions {
  /** Initial modal state */
  initialState?: Partial<ModalState>;
  /** Callback when modal is opened */
  onOpen?: () => void;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Default loading state */
  defaultLoading?: boolean;
  /** Default disabled state */
  defaultDisabled?: boolean;
}

const defaultState: ModalState = {
  isOpen: false,
  type: undefined,
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  content: null,
  onConfirm: undefined,
  onCancel: undefined,
  isConfirmLoading: false,
  isConfirmDisabled: false,
};

export function useModal({
  initialState = {},
  onOpen,
  onClose,
  defaultLoading = false,
  defaultDisabled = false,
}: UseModalOptions = {}): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    ...defaultState,
    ...initialState,
    isConfirmLoading: defaultLoading,
    isConfirmDisabled: defaultDisabled,
  });

  const openModal = useCallback((newState: Partial<ModalState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
      isOpen: true,
    }));
    onOpen?.();
  }, [onOpen]);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      isConfirmLoading: defaultLoading,
      isConfirmDisabled: defaultDisabled,
    }));
    onClose?.();
  }, [defaultLoading, defaultDisabled, onClose]);

  const updateModal = useCallback((newState: Partial<ModalState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  const setConfirmLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isConfirmLoading: loading,
    }));
  }, []);

  const setConfirmDisabled = useCallback((disabled: boolean) => {
    setState(prev => ({
      ...prev,
      isConfirmDisabled: disabled,
    }));
  }, []);

  const confirm = useCallback(async () => {
    if (state.onConfirm) {
      await state.onConfirm();
    }
  }, [state.onConfirm]);

  const cancel = useCallback(() => {
    state.onCancel?.();
    closeModal();
  }, [state.onCancel, closeModal]);

  const modalProps: Omit<ModalProps, 'children'> = {
    isOpen: state.isOpen,
    onClose: closeModal,
    type: state.type,
    title: state.title,
    description: state.description,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    onConfirm: confirm,
    onCancel: cancel,
    isConfirmLoading: state.isConfirmLoading,
    isConfirmDisabled: state.isConfirmDisabled,
  };

  return {
    modalProps,
    openModal,
    closeModal,
    updateModal,
    setConfirmLoading,
    setConfirmDisabled,
    confirm,
    cancel,
  };
}

/* Example usage:
function MyComponent() {
  const { modalProps, openModal, closeModal, setConfirmLoading } = useModal({
    onClose: () => {
      // Reset any state when modal closes
    }
  });

  const handleDelete = async () => {
    openModal({
      type: 'warning',
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await deleteItem();
          closeModal();
        } catch (error) {
          console.error(error);
        } finally {
          setConfirmLoading(false);
        }
      }
    });
  };

  return (
    <>
      <Button onClick={handleDelete}>
        Delete Item
      </Button>

      <Modal {...modalProps}>
        {state.content}
      </Modal>
    </>
  );
}

// Common modal patterns
function useConfirmationModal() {
  return useModal({
    initialState: {
      type: 'warning',
      cancelText: 'Cancel',
    }
  });
}

function useSuccessModal() {
  return useModal({
    initialState: {
      type: 'success',
      confirmText: 'OK',
    }
  });
}

function useErrorModal() {
  return useModal({
    initialState: {
      type: 'error',
      confirmText: 'OK',
    }
  });
}
*/