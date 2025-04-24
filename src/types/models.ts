export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  userId: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  userId: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high';
  defaultBudgetView: 'monthly' | 'weekly';
  theme?: 'light' | 'dark' | 'system';
}

export interface MongoDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Helper type to convert MongoDB _id to id
export type WithId<T> = Omit<T & MongoDocument, '_id'> & { id: string };

// Utility type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}