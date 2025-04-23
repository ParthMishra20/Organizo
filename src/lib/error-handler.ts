import { toast } from 'react-hot-toast';
import { MongoServerError } from 'mongodb';

interface AuthError extends Error {
  code?: string;
  status?: number;
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && ('code' in error || 'status' in error);
}

export function isMongoError(error: unknown): error is MongoServerError {
  return error instanceof MongoServerError;
}

export function handleError(error: unknown): void {
  console.error('Error:', error);

  if (isAuthError(error)) {
    // Handle authentication errors
    if (error.code === 'session_expired' || error.status === 401) {
      toast.error('Your session has expired. Please sign in again.');
    } else if (error.code === 'not_authenticated' || error.status === 403) {
      toast.error('Please sign in to continue.');
    } else {
      toast.error(error.message || 'Authentication error occurred');
    }
  } else if (isMongoError(error)) {
    // Handle MongoDB errors
    switch (error.code) {
      case 11000:
        toast.error('This item already exists');
        break;
      case 121:
        toast.error('Invalid data format');
        break;
      default:
        toast.error('Database error occurred');
    }
  } else if (error instanceof Error) {
    // Handle generic errors
    toast.error(error.message);
  } else if (typeof error === 'string') {
    toast.error(error);
  } else {
    toast.error('An unexpected error occurred');
  }
}

export function withErrorHandling<T>(
  operation: () => Promise<T>,
  customErrorMessage?: string
): Promise<T> {
  return operation().catch((error) => {
    handleError(error);
    if (customErrorMessage) {
      toast.error(customErrorMessage);
    }
    throw error;
  });
}

// Helper to create a user-friendly error message
export function createErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// Helper to show success messages
export function showSuccess(message: string): void {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#059669',
      color: '#fff',
    },
  });
}

// Helper to show error messages
export function showError(message: string): void {
  toast.error(message, {
    duration: 5000,
    style: {
      background: '#DC2626',
      color: '#fff',
    },
  });
}

// Helper to show warning messages
export function showWarning(message: string): void {
  toast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: '#D97706',
      color: '#fff',
    },
  });
}