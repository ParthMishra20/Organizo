import { useDataLoader, useMutation } from './useDataLoader';
import { getCollection } from '../lib/mongodb';
import type { ObjectId } from 'mongodb';

interface MongoDbOptions {
  collection: string;
  userId: string;
}

export function useMongoDb<T extends { _id?: ObjectId; userId: string }>(options: MongoDbOptions) {
  const { collection, userId } = options;

  // Fetch all documents for the user
  const useFind = (query = {}) => {
    return useDataLoader<T[]>(
      async () => {
        const coll = await getCollection(collection);
        return coll.find({ ...query, userId }).toArray() as Promise<T[]>;
      },
      {
        loadingMessage: `Loading ${collection}...`,
        errorMessage: `Failed to load ${collection}`
      }
    );
  };

  // Fetch a single document by ID
  const useFindOne = (id: ObjectId) => {
    return useDataLoader<T>(
      async () => {
        const coll = await getCollection(collection);
        return coll.findOne({ _id: id, userId }) as Promise<T>;
      },
      {
        loadingMessage: `Loading ${collection} item...`,
        errorMessage: `Failed to load ${collection} item`
      }
    );
  };

  // Create a new document
  const useCreate = () => {
    return useMutation<T, Omit<T, '_id' | 'userId'>>(
      async (data) => {
        const coll = await getCollection(collection);
        const doc = { ...data, userId } as T;
        const result = await coll.insertOne(doc);
        return { ...doc, _id: result.insertedId } as T;
      },
      {
        loadingMessage: `Creating ${collection}...`,
        successMessage: `${collection} created successfully`,
        errorMessage: `Failed to create ${collection}`
      }
    );
  };

  // Update an existing document
  const useUpdate = () => {
    return useMutation<T, { id: ObjectId; data: Partial<T> }>(
      async ({ id, data }) => {
        const coll = await getCollection(collection);
        await coll.updateOne(
          { _id: id, userId },
          { $set: { ...data, updatedAt: new Date() } }
        );
        return coll.findOne({ _id: id, userId }) as Promise<T>;
      },
      {
        loadingMessage: `Updating ${collection}...`,
        successMessage: `${collection} updated successfully`,
        errorMessage: `Failed to update ${collection}`
      }
    );
  };

  // Delete a document
  const useDelete = () => {
    return useMutation<boolean, ObjectId>(
      async (id) => {
        const coll = await getCollection(collection);
        const result = await coll.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
      },
      {
        loadingMessage: `Deleting ${collection}...`,
        successMessage: `${collection} deleted successfully`,
        errorMessage: `Failed to delete ${collection}`
      }
    );
  };

  // Count documents
  const useCount = (query = {}) => {
    return useDataLoader<number>(
      async () => {
        const coll = await getCollection(collection);
        return coll.countDocuments({ ...query, userId });
      },
      {
        loadingMessage: `Counting ${collection}...`,
        errorMessage: `Failed to count ${collection}`
      }
    );
  };

  return {
    useFind,
    useFindOne,
    useCreate,
    useUpdate,
    useDelete,
    useCount
  };
}