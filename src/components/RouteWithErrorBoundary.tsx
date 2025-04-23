import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

interface RouteWithErrorBoundaryProps {
  path: string;
  element: React.ReactNode;
  requiresAuth?: boolean;
  loadingMessage?: string;
}

export default function RouteWithErrorBoundary({
  path,
  element,
  requiresAuth = false,
  loadingMessage = 'Loading...'
}: RouteWithErrorBoundaryProps) {
  const wrappedElement = (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Error Loading Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We encountered an error while loading this page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      }
    >
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        {element}
      </Suspense>
    </ErrorBoundary>
  );

  return <Route path={path} element={wrappedElement} />;
}

// Helper function to create protected routes
export function createProtectedRoute(
  path: string,
  element: React.ReactNode,
  loadingMessage?: string
) {
  return (
    <RouteWithErrorBoundary
      path={path}
      element={element}
      requiresAuth={true}
      loadingMessage={loadingMessage}
    />
  );
}

// Helper function to create public routes
export function createPublicRoute(
  path: string,
  element: React.ReactNode,
  loadingMessage?: string
) {
  return (
    <RouteWithErrorBoundary
      path={path}
      element={element}
      requiresAuth={false}
      loadingMessage={loadingMessage}
    />
  );
}