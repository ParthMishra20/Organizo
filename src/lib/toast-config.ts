import { ToasterProps, toast } from 'react-hot-toast';

// Global toaster configuration
export const TOAST_CONFIG: Partial<ToasterProps> = {
  position: 'bottom-right',
  gutter: 8,
  toastOptions: {
    duration: 4000,
    style: {
      background: '#333',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '500px',
    },
    success: {
      duration: 3000,
      style: {
        background: '#059669',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#059669',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#DC2626',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#DC2626',
      },
    },
  },
};

// Message templates
const MESSAGES = {
  auth: {
    signedIn: 'Successfully signed in',
    signedOut: 'Successfully signed out',
    sessionExpired: 'Your session has expired. Please sign in again',
    unauthorized: 'Please sign in to continue',
  },
  data: {
    saved: 'Changes saved successfully',
    deleted: 'Item deleted successfully',
    error: 'An error occurred while processing your request',
    notFound: 'The requested item was not found',
  },
  connection: {
    offline: 'You are offline. Some features may be unavailable',
    reconnected: 'Connection restored',
    error: 'Connection error. Please check your internet connection',
  },
} as const;

// Toast helper functions
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        ...TOAST_CONFIG.toastOptions?.style,
        ...TOAST_CONFIG.toastOptions?.success?.style,
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        ...TOAST_CONFIG.toastOptions?.style,
        ...TOAST_CONFIG.toastOptions?.error?.style,
      },
    });
  },
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        ...TOAST_CONFIG.toastOptions?.style,
        background: '#D97706',
      },
    });
  },
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        ...TOAST_CONFIG.toastOptions?.style,
        background: '#3B82F6',
      },
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        ...TOAST_CONFIG.toastOptions?.style,
        background: '#4B5563',
      },
    });
  },
};

export { MESSAGES };