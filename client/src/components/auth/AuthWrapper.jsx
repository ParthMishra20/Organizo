import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Spinner, VStack, Text } from '@chakra-ui/react';

const AuthWrapper = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <VStack spacing={4} pt={20}>
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </VStack>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default AuthWrapper;