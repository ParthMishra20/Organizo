import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
}

interface TransactionFormData {
  type: Transaction['type'];
  amount: number;
  category: string;
  description: string;
}

export default function BudgetBuddy() {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchBudgetData();
  }, [userId]);

  async function fetchBudgetData() {
    try {
      setIsLoading(true);
      // TODO: Implement MongoDB fetch
      // For now using mock data
      setTransactions([
        {
          _id: '1',
          type: 'income',
          amount: 5000,
          category: 'Salary',
          description: 'Monthly salary',
          date: '2024-04-01'
        },
        {
          _id: '2',
          type: 'expense',
          amount: 50,
          category: 'Food',
          description: 'Groceries',
          date: '2024-04-23'
        }
      ]);

      setBudgets([
        {
          _id: '1',
          category: 'Food',
          amount: 500,
          spent: 350
        },
        {
          _id: '2',
          category: 'Entertainment',
          amount: 200,
          spent: 150
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch budget data');
      console.error('Error fetching budget data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: Implement MongoDB insert
      const newTransaction: Transaction = {
        _id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setTransactions(prev => [...prev, newTransaction]);

      // Update budget if it's an expense
      if (formData.type === 'expense') {
        setBudgets(prev =>
          prev.map(budget =>
            budget.category === formData.category
              ? { ...budget, spent: budget.spent + formData.amount }
              : budget
          )
        );
      }

      setIsAddingTransaction(false);
      setFormData({
        type: 'expense',
        amount: 0,
        category: '',
        description: ''
      });
      toast.success('Transaction added successfully');
    } catch (error) {
      toast.error('Failed to add transaction');
      console.error('Error adding transaction:', error);
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalIncome}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalExpenses}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Balance</h3>
          <p className={`text-2xl font-bold ${
            totalIncome - totalExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>${totalIncome - totalExpenses}</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgets.map(budget => (
            <div key={budget._id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-200">{budget.category}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  ${budget.spent} / ${budget.amount}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (budget.spent / budget.amount) > 0.9 ? 'bg-red-600' :
                    (budget.spent / budget.amount) > 0.7 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Form */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </div>

      {isAddingTransaction && (
        <form onSubmit={handleAddTransaction} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as Transaction['type'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingTransaction(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map(transaction => (
          <div
            key={transaction._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{transaction.description}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className={`font-medium ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}