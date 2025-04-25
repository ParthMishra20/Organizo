import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type TransactionType = 'spend' | 'receive' | 'invest';
export type TransactionTag = 'food' | 'travel' | 'subscription' | 'shopping' | 'misc';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  tag?: TransactionTag;
  date: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  name: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  starting_income: number;
  current_balance: number;
  created_at: string;
}