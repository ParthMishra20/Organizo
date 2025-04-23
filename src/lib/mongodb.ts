import { MongoClient, ObjectId, MongoClientOptions } from 'mongodb';
import type { WithId, Document } from 'mongodb';
import { withDatabaseOperation } from './middleware';
import { toast } from 'react-hot-toast';

// MongoDB connection string from environment variable
const uri = import.meta.env.VITE_MONGODB_URI;

if (!uri) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

// Database Name
const dbName = 'organizo';

// MongoDB client options
const options: MongoClientOptions = {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10
};

// Create a MongoClient instance
const client = new MongoClient(uri, options);

// Track connection status
let isConnected = false;

// Graceful shutdown function
async function shutdown(): Promise<void> {
  try {
    if (isConnected) {
      await client.close();
      isConnected = false;
      console.log('MongoDB connection closed.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
}

// Handle cleanup on app shutdown
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`Received ${signal}. Closing MongoDB connection...`);
    shutdown().catch(console.error);
  });
});

export async function connectToDatabase() {
  return withDatabaseOperation(async () => {
    if (!isConnected) {
      console.log('Connecting to MongoDB...');
      await client.connect();
      await client.db(dbName).command({ ping: 1 });
      console.log('Successfully connected to MongoDB.');
      isConnected = true;
    }
    return { db: client.db(dbName), client };
  });
}

export async function getCollection(collectionName: string) {
  return withDatabaseOperation(async () => {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    console.log(`Accessing collection: ${collectionName}`);
    return collection;
  });
}

// Types for our collections
export interface Task {
  _id?: ObjectId;
  userId: string;
  name: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  _id?: ObjectId;
  userId: string;
  currentBudget: number;
  monthlyIncome: number;
  lastUpdated: string;
  isInitialized: boolean;
}

export interface Transaction {
  _id?: ObjectId;
  userId: string;
  type: 'spend' | 'receive' | 'invest';
  amount: number;
  description: string;
  date: string;
  tag?: string;
  createdAt: Date;
}

// Helper functions for working with ObjectIds
export function toObjectId(id: string | ObjectId): ObjectId {
  return typeof id === 'string' ? new ObjectId(id) : id;
}

export function fromObjectId(id: ObjectId | undefined): string | undefined {
  return id?.toString();
}

// Document conversion helper
export function convertDocument<T extends { _id?: ObjectId }>(doc: WithId<Document>): T {
  const { _id, ...rest } = doc;
  return { _id, ...rest } as T;
}