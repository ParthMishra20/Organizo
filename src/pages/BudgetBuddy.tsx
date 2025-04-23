import React, { useState, useEffect } from 'react';
import { format, isFirstDayOfMonth, addMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Plus, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { ObjectId } from 'mongodb';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import InitialBudgetModal from '../components/InitialBudgetModal';
import toast from 'react-hot-toast';
import { Transaction, Budget, getCollection, convertDocument } from '../lib/mongodb';

export default function BudgetBuddy() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialSetupOpen, setIsInitialSetupOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'spend' | 'receive' | 'invest'>('spend');
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBudget();
      fetchTransactions();
    }
  }, [user]);

  const fetchBudget = async () => {
    if (!user) return;

    try {
      const budgetsCollection = await getCollection('budgets');
      const data = await budgetsCollection.findOne({ userId: user.id });

      if (data) {
        setBudget(convertDocument<Budget>(data));

        if (!data.isInitialized) {
          setIsInitialSetupOpen(true);
        }
      } else {
        // Create initial budget record if it doesn't exist
        const initialBudget = {
          userId: user.id,
          currentBudget: 0,
          monthlyIncome: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
          isInitialized: false
        };
        
        await budgetsCollection.insertOne(initialBudget);
        setBudget(initialBudget);
        setIsInitialSetupOpen(true);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast.error('Failed to fetch budget');
    }
  };

  const handleInitialSetup = async (monthlyIncome: number) => {
    if (!user || !budget) return;

    try {
      const budgetsCollection = await getCollection('budgets');
      await budgetsCollection.updateOne(
        { userId: user.id },
        {
          $set: {
            monthlyIncome,
            currentBudget: monthlyIncome,
            isInitialized: true,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      );

      await fetchBudget();
      setIsInitialSetupOpen(false);
      toast.success('Budget initialized successfully!');
    } catch (error) {
      console.error('Error initializing budget:', error);
      toast.error('Failed to set up initial budget');
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const transactionsCollection = await getCollection('transactions');
      const rawTransactions = await transactionsCollection
        .find({ userId: user.id })
        .sort({ date: -1 })
        .toArray();
      
      setTransactions(rawTransactions.map(doc => convertDocument<Transaction>(doc)));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  const handleAddTransaction = async (data: Omit<Transaction, '_id' | 'userId' | 'createdAt'>) => {
    if (!budget || !user) return;

    try {
      const transactionsCollection = await getCollection('transactions');
      const budgetsCollection = await getCollection('budgets');

      const newTransaction = {
        ...data,
        userId: user.id,
        createdAt: new Date()
      };

      await transactionsCollection.insertOne(newTransaction);

      const newBudgetAmount =
        data.type === 'spend'
          ? budget.currentBudget - data.amount
          : data.type === 'receive'
          ? budget.currentBudget + data.amount
          : budget.currentBudget - data.amount;

      await budgetsCollection.updateOne(
        { userId: user.id },
        {
          $set: {
            currentBudget: newBudgetAmount,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      );

      await fetchTransactions();
      await fetchBudget();
      setIsModalOpen(false);
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleUpdateIncome = async () => {
    if (!budget || !user) return;

    const canUpdateIncome = isFirstDayOfMonth(new Date()) &&
      format(new Date(budget.lastUpdated), 'yyyy-MM') !== format(new Date(), 'yyyy-MM');

    if (!canUpdateIncome) {
      const nextUpdateDate = addMonths(new Date(budget.lastUpdated), 1);
      toast.error(`Income can only be updated on ${format(nextUpdateDate, 'MMM dd, yyyy')}`);
      return;
    }

    try {
      const budgetsCollection = await getCollection('budgets');
      await budgetsCollection.updateOne(
        { userId: user.id },
        {
          $set: {
            currentBudget: budget.currentBudget + budget.monthlyIncome,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      );

      await fetchBudget();
      toast.success('Monthly income added successfully!');
    } catch (error) {
      console.error('Error updating income:', error);
      toast.error('Failed to update income');
    }
  };

  if (!budget) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-gray-400">Loading budget information...</p>
      </div>
    );
  }

  const monthlyData = transactions
    .filter(t => t.type === 'spend' && t.tag)
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.tag);
      if (existing) {
        existing.value += t.amount;
      } else if (t.tag) {
        acc.push({ name: t.tag, value: t.amount, color: getTagColor(t.tag) });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  const yearlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthTransactions = transactions.filter(t => 
      new Date(t.date).getMonth() === month.getMonth() &&
      new Date(t.date).getFullYear() === month.getFullYear()
    );

    return {
      month: format(month, 'MMM'),
      income: monthTransactions
        .filter(t => t.type === 'receive')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTransactions
        .filter(t => t.type === 'spend')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  }).reverse();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Current Budget
          </h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            ₹{budget.currentBudget.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {format(new Date(budget.lastUpdated), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Monthly Income
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ₹{budget.monthlyIncome.toLocaleString()}
          </p>
          <button
            onClick={handleUpdateIncome}
            className={`mt-4 flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              isFirstDayOfMonth(new Date())
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFirstDayOfMonth(new Date())}
          >
            <Plus size={20} className="mr-2" />
            Add Monthly Income
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Transaction Tracker
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Yearly View
            </button>
          </div>
        </div>
        <div className="flex justify-center transition-all duration-500 transform">
          {viewMode === 'monthly' ? (
            monthlyData.length > 0 ? (
              <PieChart width={800} height={400}>
                <Pie
                  data={monthlyData}
                  cx={400}
                  cy={200}
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 py-8">
                No spending data available for this month
              </p>
            )
          ) : (
            <BarChart width={800} height={400} data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" />
              <Bar dataKey="expenses" fill="#f44336" />
            </BarChart>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Transactions
        </h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setTransactionType('spend');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            <ArrowDownRight size={20} className="mr-2" />
            Spend
          </button>
          <button
            onClick={() => {
              setTransactionType('receive');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            <ArrowUpRight size={20} className="mr-2" />
            Receive
          </button>
          <button
            onClick={() => {
              setTransactionType('invest');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-300"
          >
            <ArrowRight size={20} className="mr-2" />
            Invest
          </button>
        </div>

        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div
                key={transaction._id ? transaction._id.toString() : undefined}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center">
                  {transaction.type === 'spend' && (
                    <ArrowDownRight className="text-red-500 mr-3" size={24} />
                  )}
                  {transaction.type === 'receive' && (
                    <ArrowUpRight className="text-green-500 mr-3" size={24} />
                  )}
                  {transaction.type === 'invest' && (
                    <ArrowRight className="text-yellow-500 mr-3" size={24} />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-lg font-semibold ${
                      transaction.type === 'spend'
                        ? 'text-red-600 dark:text-red-400'
                        : transaction.type === 'receive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {transaction.type === 'spend' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                  </span>
                  {transaction.tag && (
                    <span className="ml-4 px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {transaction.tag}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No transactions yet. Add your first transaction!
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Transaction`}
      >
        <TransactionForm
          type={transactionType}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <InitialBudgetModal
        isOpen={isInitialSetupOpen}
        onSubmit={handleInitialSetup}
      />
    </div>
  );
}

function getTagColor(tag: string): string {
  switch (tag) {
    case 'travel':
      return '#4CAF50';
    case 'food':
      return '#2196F3';
    case 'light snacks':
      return '#FFC107';
    case 'wants':
      return '#9C27B0';
    default:
      return '#9E9E9E';
  }
}