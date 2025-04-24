import { useAuth } from '@clerk/clerk-react';
import useAsync from './useAsync';
import type { ApiResponse } from '../types/models';
import { AuthenticationError } from '../lib/errors';

interface UseMongoDbOptions<T> {
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useMongoDb<T>(
  dbOperation: (userId: string, ...args: any[]) => Promise<T[]>,
  options: UseMongoDbOptions<T> = {}
) {
  const { userId } = useAuth();

  const wrappedOperation = async (...args: any[]) => {
    if (!userId) {
      throw new AuthenticationError();
    }
    try {
      return await dbOperation(userId, ...args);
    } catch (error) {
      // Re-throw authentication errors, let useAsync handle other errors
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw error;
    }
  };

  const {
    execute,
    isLoading,
    error,
    data,
    reset
  } = useAsync<T[]>(wrappedOperation, {
    loadingMessage: options.loadingMessage || 'Loading data...',
    successMessage: options.successMessage,
    errorMessage: options.errorMessage,
    onSuccess: options.onSuccess,
    onError: options.onError
  });

  return {
    execute,
    isLoading,
    error,
    data,
    reset
  };
}

export default useMongoDb;