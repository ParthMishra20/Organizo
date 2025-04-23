import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

interface LoadingContextType {
  isLoading: boolean;
  message: string | undefined;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
  minimumLoadingTime?: number;
}

export function LoadingProvider({ 
  children, 
  minimumLoadingTime = 300 
}: LoadingProviderProps) {
  const [{ isLoading, message }, setState] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
  });

  const loadingTimerRef = useRef<number>();
  const loadingStartTimeRef = useRef<number>();

  const startLoading = useCallback((message?: string) => {
    loadingStartTimeRef.current = Date.now();
    setState({ isLoading: true, message });
  }, []);

  const stopLoading = useCallback(() => {
    const startTime = loadingStartTimeRef.current || 0;
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

    clearTimeout(loadingTimerRef.current);
    
    if (remainingTime > 0) {
      loadingTimerRef.current = window.setTimeout(() => {
        setState({ isLoading: false, message: undefined });
      }, remainingTime);
    } else {
      setState({ isLoading: false, message: undefined });
    }
  }, [minimumLoadingTime]);

  const withLoading = useCallback(async <T,>(
    promise: Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message);
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const value = {
    isLoading,
    message,
    startLoading,
    stopLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
}

/* Example usage:
const Component = () => {
  const { withLoading, isLoading } = useLoading();

  const handleClick = async () => {
    await withLoading(
      fetchData(),
      'Loading data...'
    );
  };

  // or manually:
  const handleManualLoading = async () => {
    const { startLoading, stopLoading } = useLoading();
    try {
      startLoading('Processing...');
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : <Content />}
    </div>
  );
};
*/