import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string, username: string) {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  if (authData.user) {
    // Then create the user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          username,
        }
      ]);

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.signOut();
      throw profileError;
    }

    // Create initial budget with 0 balance
    const { error: budgetError } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: authData.user.id,
          current_budget: 0,
          monthly_income: 0,
          last_updated: new Date().toISOString().split('T')[0],
          is_initialized: false
        }
      ]);

    if (budgetError) {
      console.error('Failed to create initial budget:', budgetError);
    }
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function initializeBudget(userId: string, initialBalance: number) {
  const { error } = await supabase
    .from('budgets')
    .update({
      current_budget: initialBalance,
      is_initialized: true,
    })
    .eq('user_id', userId);

  if (error) throw error;
}