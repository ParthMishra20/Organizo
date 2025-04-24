import { useState, useCallback } from 'react';
import { useLoading } from '../context/LoadingContext';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAsyncResult<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        if (options.loadingMessage) {
          startLoading(options.loadingMessage);
        }
        
        const result = await Promise.resolve(asyncFunction(...args));
        setData(result);
        options.onSuccess?.(result);
        
        if (options.successMessage) {
          showSuccessToast(options.successMessage);
        }
        
        return result;
      } catch (e) {
        const error = e as Error;
        setError(error);
        options.onError?.(error);
        showErrorToast(error, { duration: 5000 });
        console.error('Operation failed:', error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    },
    [asyncFunction, options, startLoading, stopLoading]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

export default useAsync;