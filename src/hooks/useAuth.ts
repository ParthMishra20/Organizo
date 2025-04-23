import { useUser } from '@clerk/clerk-react';
import { useCallback } from 'react';
import { useMongoDb } from './useMongoDb';
import type { ObjectId } from 'mongodb';

// Define a base type for user data in MongoDB
interface UserData {
  _id?: ObjectId;
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth<T extends UserData>() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Create MongoDB hooks with user context
  const getMongoHooks = useCallback((collection: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    return useMongoDb<T>({
      collection,
      userId: user.id
    });
  }, [user?.id]);

  // Helper to ensure user is authenticated
  const requireAuth = useCallback(<R>(operation: () => R): R => {
    if (!isLoaded) {
      throw new Error('Authentication not initialized');
    }
    if (!isSignedIn || !user) {
      throw new Error('User not authenticated');
    }
    return operation();
  }, [isLoaded, isSignedIn, user]);

  // Get current user data from MongoDB
  const useUserData = (collection: string = 'users') => {
    const { useFind } = getMongoHooks(collection);
    const { data, isLoading, error, refresh } = useFind();

    const userData = data?.[0] as T | undefined;

    return {
      userData,
      isLoading,
      error,
      refresh,
      user, // Clerk user object
      isAuthenticated: isSignedIn && !!user,
    };
  };

  // Initialize or update user data in MongoDB
  const useInitializeUser = (collection: string = 'users') => {
    const { useCreate, useUpdate } = getMongoHooks(collection);
    const createUser = useCreate();
    const updateUser = useUpdate();

    const initializeUser = async (data: Partial<T>) => {
      return requireAuth(async () => {
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }

        const userDoc = {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as T;

        return createUser.execute(userDoc);
      });
    };

    const updateUserData = async (id: ObjectId, data: Partial<T>) => {
      return requireAuth(async () => {
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }

        return updateUser.execute({
          id,
          data: {
            ...data,
            updatedAt: new Date(),
            userId: user.id // Ensure userId is always set
          }
        });
      });
    };

    return {
      initializeUser,
      updateUserData,
      isLoading: createUser.isLoading || updateUser.isLoading,
      error: createUser.error || updateUser.error
    };
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    getMongoHooks,
    requireAuth,
    useUserData,
    useInitializeUser
  };
}

// Type guard to check if a user is authenticated
export function isAuthenticated(user: unknown): user is NonNullable<ReturnType<typeof useUser>['user']> {
  return !!user && typeof user === 'object' && 'id' in user;
}