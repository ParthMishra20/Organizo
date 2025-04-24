import toast from 'react-hot-toast';
import { formatErrorMessage } from '../lib/errors';

interface ToastOptions {
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

const defaultDurations = {
  success: 2000,
  error: 4000,
  info: 3000,
  warning: 3000,
};

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const styles = {
  success: {
    background: 'rgb(5, 150, 105)',
    color: '#fff',
  },
  error: {
    background: 'rgb(220, 38, 38)',
    color: '#fff',
  },
  info: {
    background: 'rgb(59, 130, 246)',
    color: '#fff',
  },
  warning: {
    background: 'rgb(245, 158, 11)',
    color: '#fff',
  },
};

export function showToast(
  message: string,
  { variant = 'info', duration, position = 'top-right' }: ToastOptions = {}
) {
  toast(message, {
    icon: icons[variant],
    duration: duration || defaultDurations[variant],
    position,
    style: styles[variant],
  });
}

export function showSuccessToast(message: string, options?: Omit<ToastOptions, 'variant'>) {
  showToast(message, { ...options, variant: 'success' });
}

export function showErrorToast(error: Error | string, options?: Omit<ToastOptions, 'variant'>) {
  const message = error instanceof Error ? formatErrorMessage(error) : error;
  showToast(message, { ...options, variant: 'error' });
}

export function showWarningToast(message: string, options?: Omit<ToastOptions, 'variant'>) {
  showToast(message, { ...options, variant: 'warning' });
}

export function showInfoToast(message: string, options?: Omit<ToastOptions, 'variant'>) {
  showToast(message, { ...options, variant: 'info' });
}

// Loading toast that can be dismissed
export function showLoadingToast(message: string = 'Loading...') {
  return toast.loading(message, {
    style: {
      background: '#333',
      color: '#fff',
    },
  });
}

// Update an existing toast
export function updateToast(toastId: string, message: string, type: 'success' | 'error') {
  toast.dismiss(toastId);
  showToast(message, { variant: type });
}