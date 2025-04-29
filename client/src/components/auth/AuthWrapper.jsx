import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Spinner, VStack, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

const AuthWrapper = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const toast = useToast();

  // Add debugging for authentication state
  useEffect(() => {
    if (isLoaded) {
      console.log('Auth state:', { 
        isSignedIn, 
        userId: user?.id,
        primaryEmailAddress: user?.primaryEmailAddress?.emailAddress
      });
      
      if (isSignedIn && user?.id) {
        // Log successful authentication
        console.log('User authenticated successfully:', user.id);
      }
    }
  }, [isLoaded, isSignedIn, user]);

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
    
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default AuthWrapper;