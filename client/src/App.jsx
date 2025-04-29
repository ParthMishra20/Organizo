import { ChakraProvider, ColorModeScript, useToast } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import AuthLayout from './components/auth/AuthLayout';
import Home from './pages/Home';
import BudgetPage from './pages/budget/BudgetPage';
import TaskManager from './pages/tasks/TaskManager';
import TestUI from './pages/TestUI';
import AuthWrapper from './components/auth/AuthWrapper';
import theme from './theme';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Get the current domain for Clerk redirects
const getBaseUrl = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5173';
  }
  // In production, use the deployed URL
  return window.location.origin;
};

// Clerk appearance settings
const appearance = {
  elements: {
    formButtonPrimary: {
      fontSize: '16px',
      fontWeight: 600,
      textTransform: 'none',
      backgroundColor: 'var(--chakra-colors-brand-500)',
      '&:hover': {
        backgroundColor: 'var(--chakra-colors-brand-600)'
      }
    },
    card: {
      border: 'none',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: '0',
    },
    socialButtonsBlockButton: {
      width: '100%',
      marginTop: '8px',
      marginBottom: '8px',
      borderRadius: '8px',
      border: '1px solid var(--chakra-colors-gray-200)',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: 'var(--chakra-colors-gray-50)',
      }
    },
    socialButtonsBlockButtonText: {
      fontWeight: '500',
      fontSize: '14px',
    },
    footerActionText: {
      fontSize: '14px',
      color: 'var(--chakra-colors-gray-600)',
    },
    footerActionLink: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--chakra-colors-brand-500)',
      '&:hover': {
        color: 'var(--chakra-colors-brand-600)',
      }
    },
    dividerLine: {
      borderColor: 'var(--chakra-colors-gray-200)',
    },
    dividerText: {
      color: 'var(--chakra-colors-gray-500)',
    },
    formFieldLabel: {
      fontSize: '14px',
      fontWeight: '500',
    },
    formFieldInput: {
      fontSize: '16px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid var(--chakra-colors-gray-200)',
      '&:focus': {
        borderColor: 'var(--chakra-colors-brand-500)',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
      }
    },
    navbar: {
      display: 'none',
    }
  },
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'blockButton',
    privacyPageUrl: 'https://clerk.com/privacy',
    helpPageUrl: 'https://clerk.com/help',
  },
};

function AuthDebugger() {
  const toast = useToast();
  
  useEffect(() => {
    // Log auth debugging information
    console.log('Auth debugger initialized');
    console.log('Current URL:', window.location.href);
    console.log('Base URL:', getBaseUrl());
    
    // Check if Clerk is loaded properly
    if (window.Clerk) {
      console.log('Clerk is loaded');
    } else {
      console.log('Clerk is not loaded');
      toast({
        title: 'Authentication Error',
        description: 'Failed to load authentication service. Please try refreshing the page.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [toast]);
  
  return null;
}

function App() {
  const baseUrl = getBaseUrl();
  
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={appearance}
      navigate={(to) => window.location.href = to}
    >
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Router>
          <AuthDebugger />
          <Routes>
            {/* Auth Routes */}
            <Route 
              path="/sign-in/*" 
              element={
                <AuthLayout>
                  <SignIn 
                    routing="path" 
                    path="/sign-in" 
                    signUpUrl="/sign-up" 
                    afterSignInUrl="/"
                    redirectUrl={baseUrl}
                  />
                </AuthLayout>
              } 
            />
            <Route 
              path="/sign-up/*" 
              element={
                <AuthLayout>
                  <SignUp 
                    routing="path" 
                    path="/sign-up" 
                    signInUrl="/sign-in" 
                    afterSignUpUrl="/"
                    redirectUrl={baseUrl}
                  />
                </AuthLayout>
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <AuthWrapper>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/tasks" element={<TaskManager />} />
                      <Route path="/budget" element={<BudgetPage />} />
                      {import.meta.env.DEV && (
                        <Route path="/test-ui" element={<TestUI />} />
                      )}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </AuthWrapper>
              }
            />
          </Routes>
        </Router>
      </ChakraProvider>
    </ClerkProvider>
  );
}

export default App;
