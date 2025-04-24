import React from 'react';
import { useLoading } from '../context/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingOverlay() {
  const { isLoading, message } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-sm w-full mx-4 space-y-4 animate-slide-in">
        <LoadingSpinner size="lg" className="mx-auto" />
        {message && (
          <p className="text-center text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Custom hook to show global loading with a message
export function useLoadingWithMessage() {
  const { startLoading, stopLoading } = useLoading();

  const showLoading = React.useCallback((message: string) => {
    startLoading(message);
  }, [startLoading]);

  const hideLoading = React.useCallback(() => {
    stopLoading();
  }, [stopLoading]);

  return { showLoading, hideLoading };
}