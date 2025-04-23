import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import { NavigationProvider } from './context/NavigationContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/globals.css';

// Lazy load pages
const Profile = React.lazy(() => import('./pages/Profile'));
const TaskScheduler = React.lazy(() => import('./pages/TaskScheduler'));
const BudgetBuddy = React.lazy(() => import('./pages/BudgetBuddy'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Route wrapper with error boundary and suspense
const ProtectedRoute = ({ element: Element }: { element: React.ComponentType }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Element />
    </Suspense>
  </ErrorBoundary>
);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

function App() {
  return (
    <ThemeProvider 
      defaultTheme="system" 
      storageKey="organizo-theme"
    >
      <LoadingProvider>
        <NavigationProvider>
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={<ProtectedRoute element={Dashboard} />}
              />
              <Route 
                path="/profile" 
                element={<ProtectedRoute element={Profile} />}
              />
              <Route 
                path="/tasks" 
                element={<ProtectedRoute element={TaskScheduler} />}
              />
              <Route 
                path="/budget" 
                element={<ProtectedRoute element={BudgetBuddy} />}
              />
            </Routes>
          </Layout>
        </NavigationProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;