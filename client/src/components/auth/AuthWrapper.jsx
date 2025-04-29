import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Spinner, VStack, Text, useToast, Alert, AlertIcon, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const AuthWrapper = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const toast = useToast();
  const [authError, setAuthError] = useState(null);

  // Add enhanced debugging for authentication state
  useEffect(() => {
    if (isLoaded) {
      console.log('Auth state:', { 
        isSignedIn, 
        userId: user?.id,
        primaryEmailAddress: user?.primaryEmailAddress?.emailAddress,
        hasPublicMetadata: !!user?.publicMetadata,
        userLoaded: !!user,
        environment: import.meta.env.MODE,
        origin: window.location.origin
      });
      
      if (isSignedIn && user?.id) {
        // Log successful authentication
        console.log('User authenticated successfully:', user.id);
        setAuthError(null);
      } else if (isLoaded && !isSignedIn) {
        console.warn('User not signed in after auth loaded');
        setAuthError('Authentication required. Please sign in to continue.');
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Handle authentication errors
  useEffect(() => {
    const handleClerkError = () => {
      if (window.Clerk && window.Clerk.sessions) {
        console.log('Clerk sessions available:', window.Clerk.sessions.length);
      } else {
        console.warn('Clerk sessions not available');
      }
    };

    // Check if Clerk is available after a short delay
    const timer = setTimeout(handleClerkError, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <VStack spacing={4} pt={20}>
        <Spinner size="xl" />
        <Text>Loading authentication...</Text>
      </VStack>
    );
  }

  if (!isSignedIn) {
    // Show a toast notification about redirect
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access the application.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    return (
      <>
        {authError && (
          <Box position="fixed" top="4" right="4" zIndex="toast">
            <Alert status="error" variant="solid" rounded="md">
              <AlertIcon />
              {authError}
            </Alert>
          </Box>
        )}
        <Navigate to="/sign-in" replace />
      </>
    );
  }

  return children;
};

export default AuthWrapper;