'use client';

import { FiArrowUpRight, FiArrowDownRight, FiDollarSign } from 'react-icons/fi';
import { format } from 'date-fns';
import type { Transaction } from '@/utils/supabase';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'receive':
        return <FiArrowUpRight className="text-green-500" size={20} />;
      case 'spend':
        return <FiArrowDownRight className="text-red-500" size={20} />;
      case 'invest':
        return <FiDollarSign className="text-yellow-500" size={20} />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'receive':
        return 'text-green-500';
      case 'spend':
        return 'text-red-500';
      case 'invest':
        return 'text-yellow-500';
    }
  };

  const formatTag = (tag: string) => {
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.created_at).getTime();
    const dateB = new Date(b.date + 'T' + b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction History
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                    {transaction.tag && ` • ${formatTag(transaction.tag)}`}
                  </p>
                </div>
              </div>
              <span
                className={`font-medium ${getTransactionColor(transaction.type)}`}
              >
                {transaction.type === 'receive' ? '+' : '-'} ₹{transaction.amount.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}