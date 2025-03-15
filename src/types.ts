export interface Task {
  id: string;
  user_id: string;
  name: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'spend' | 'receive' | 'invest';
  amount: number;
  description: string;
  date: string;
  tag?: 'travel' | 'food' | 'light snacks' | 'wants';
}

export interface Budget {
  currentBudget: number;
  monthlyIncome: number;
  lastUpdated: string;
  isInitialized: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at?: string;
}