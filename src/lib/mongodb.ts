import { MongoClient, ObjectId, MongoError } from 'mongodb';
import type { Task, Budget, Transaction, UserSettings } from '../types/models';
import { MongoDBError, NotFoundError, handleMongoError } from './errors';

if (!import.meta.env.VITE_MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = import.meta.env.VITE_MONGODB_URI;
const client = new MongoClient(uri);

// Database and Collection names
const DB_NAME = 'organizo';
const COLLECTIONS = {
  TASKS: 'tasks',
  BUDGETS: 'budgets',
  TRANSACTIONS: 'transactions',
  USER_SETTINGS: 'user_settings',
} as const;

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw handleMongoError(error);
  }
}

// Generic function to get a collection
export async function getCollection(collectionName: string) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

// Helper function to convert MongoDB document to regular object
export function convertDocument<T>(doc: any): T {
  const { _id, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
  } as T;
}

// Tasks
export async function getTasks(userId: string): Promise<Task[]> {
  try {
    const collection = await getCollection(COLLECTIONS.TASKS);
    const tasks = await collection.find({ userId }).toArray();
    return tasks.map(task => convertDocument<Task>(task));
  } catch (error) {
    throw handleMongoError(error);
  }
}

export async function createTask(userId: string, task: Omit<Task, 'id'>): Promise<Task> {
  try {
    const collection = await getCollection(COLLECTIONS.TASKS);
    const result = await collection.insertOne({ ...task, userId });
    return { ...task, id: result.insertedId.toString() } as Task;
  } catch (error) {
    throw handleMongoError(error);
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const collection = await getCollection(COLLECTIONS.TASKS);
  await collection.updateOne(
    { _id: new ObjectId(taskId) },
    { $set: updates }
  );
}

export async function deleteTask(taskId: string): Promise<void> {
  const collection = await getCollection(COLLECTIONS.TASKS);
  await collection.deleteOne({ _id: new ObjectId(taskId) });
}

// Budgets
export async function getBudgets(userId: string): Promise<Budget[]> {
  try {
    const collection = await getCollection(COLLECTIONS.BUDGETS);
    const budgets = await collection.find({ userId }).toArray();
    return budgets.map(budget => convertDocument<Budget>(budget));
  } catch (error) {
    throw handleMongoError(error);
  }
}

export async function createBudget(userId: string, budget: Omit<Budget, 'id'>): Promise<Budget> {
  const collection = await getCollection(COLLECTIONS.BUDGETS);
  const result = await collection.insertOne({ ...budget, userId });
  return { ...budget, id: result.insertedId.toString() } as Budget;
}

export async function updateBudget(budgetId: string, updates: Partial<Budget>): Promise<void> {
  const collection = await getCollection(COLLECTIONS.BUDGETS);
  await collection.updateOne(
    { _id: new ObjectId(budgetId) },
    { $set: updates }
  );
}

// Transactions
export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const collection = await getCollection(COLLECTIONS.TRANSACTIONS);
    const transactions = await collection.find({ userId }).toArray();
    return transactions.map(transaction => convertDocument<Transaction>(transaction));
  } catch (error) {
    throw handleMongoError(error);
  }
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const collection = await getCollection(COLLECTIONS.TRANSACTIONS);
  const result = await collection.insertOne({ ...transaction, userId });
  return { ...transaction, id: result.insertedId.toString() } as Transaction;
}

// User Settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const collection = await getCollection(COLLECTIONS.USER_SETTINGS);
    const settings = await collection.findOne({ userId });
    return settings ? convertDocument<UserSettings>(settings) : null;
  } catch (error) {
    throw handleMongoError(error);
  }
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
  const collection = await getCollection(COLLECTIONS.USER_SETTINGS);
  await collection.updateOne(
    { userId },
    { $set: settings },
    { upsert: true }
  );
}

// Cleanup function
export async function closeConnection(): Promise<void> {
  await client.close();
  console.log('Disconnected from MongoDB');
}