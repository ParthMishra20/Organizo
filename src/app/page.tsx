import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiCheckSquare, FiDollarSign } from 'react-icons/fi';

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    redirect('/task-manager');
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Welcome to Organizo
      </h1>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
        Your all-in-one solution for task management and budget tracking
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FiCheckSquare className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold ml-2 text-gray-900 dark:text-white">
              Task Manager
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Organize your tasks, set priorities, and track completion status efficiently
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
            <li>• Create and manage tasks</li>
            <li>• Set priorities and deadlines</li>
            <li>• Track completion status</li>
            <li>• View daily task summaries</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold ml-2 text-gray-900 dark:text-white">
              Budget Buddy
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Track your expenses, monitor income, and visualize spending patterns
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
            <li>• Track income and expenses</li>
            <li>• Categorize transactions</li>
            <li>• View spending analytics</li>
            <li>• Monitor monthly budgets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
