'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/utils/supabase';

interface BalanceProps {
  balance: number;
  startingIncome?: number;
}

export default function Balance({ balance, startingIncome }: BalanceProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isSettingIncome, setIsSettingIncome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const income = parseFloat(formData.get('income') as string);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          starting_income: income,
          current_balance: startingIncome ? balance : income,
        });

      if (error) throw error;
      
      setIsSettingIncome(false);
      router.refresh();
    } catch (error) {
      console.error('Error setting income:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Current Balance
        </h2>
        <button
          onClick={() => setIsSettingIncome(true)}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          {startingIncome ? 'Update Income' : 'Set Income'}
        </button>
      </div>

      {isSettingIncome ? (
        <form onSubmit={handleSetIncome} className="space-y-4">
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              id="income"
              name="income"
              defaultValue={startingIncome}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsSettingIncome(false)}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            ₹{balance.toFixed(2)}
          </p>
          {startingIncome && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Monthly Income: ₹{startingIncome.toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}