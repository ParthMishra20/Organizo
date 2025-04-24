import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { LoadingProvider } from './context/LoadingContext';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

if (!import.meta.env.VITE_MONGODB_URI) {
  throw new Error('Missing MongoDB URI');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ErrorBoundary>
        <BrowserRouter>
          <LoadingProvider>
            <App />
            <Toaster
              position="top-right"
              containerStyle={{
                top: 64, // Below navbar
              }}
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: '0.875rem',
                  maxWidth: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                },
                duration: 3000,
              }}
            />
          </LoadingProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ClerkProvider>
  </React.StrictMode>
);
