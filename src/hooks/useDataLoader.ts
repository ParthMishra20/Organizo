import { useState, useEffect } from 'react';
import { showToast } from '../lib/toast-config';
import { handleError } from '../lib/error-handler';
import { withDatabaseOperation } from '../lib/middleware';

interface DataLoaderOptions<T> {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  dependencies?: any[];
}

export function useDataLoader<T>(
  fetchFunction: () => Promise<T>,
  options: DataLoaderOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    loadingMessage = 'Loading...',
    successMessage,
    errorMessage = 'Failed to load data',
    onSuccess,
    onError,
    dependencies = []
  } = options;

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await withDatabaseOperation(async () => {
        return await fetchFunction();
      });

      setData(result);
      setIsLoading(false);
      
      if (successMessage) {
        showToast.success(successMessage);
      }
      
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      
      handleError(err);
      if (errorMessage) {
        showToast.error(errorMessage);
      }
      
      onError?.(err);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refresh = () => {
    loadData();
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    setData
  };
}

// Helper hook for mutation operations (create, update, delete)
export function useMutation<T, P = void>(
  mutationFunction: (params: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    loadingMessage = 'Processing...',
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    onSuccess,
    onError
  } = options;

  const execute = async (params: P): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await withDatabaseOperation(async () => {
        return await mutationFunction(params);
      });

      setIsLoading(false);
      showToast.success(successMessage);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      
      handleError(err);
      showToast.error(errorMessage);
      onError?.(err);
      return null;
    }
  };

  return {
    execute,
    isLoading,
    error,
    reset: () => setError(null)
  };
}