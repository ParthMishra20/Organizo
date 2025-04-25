'use client';

import { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Transaction } from '@/utils/supabase';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = {
  food: '#FF6384',
  travel: '#36A2EB',
  subscription: '#FFCE56',
  shopping: '#4BC0C0',
  misc: '#9966FF',
  invest: '#FF9F40'
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Charts({ transactions }: ChartsProps) {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate monthly spending by category
  const monthlySpending = transactions
    .filter(t => t.type === 'spend' || t.type === 'invest')
    .reduce((acc, t) => {
      const tag = t.type === 'invest' ? 'invest' : t.tag || 'misc';
      acc[tag] = (acc[tag] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate yearly spending by month
  const currentYear = new Date().getFullYear();
  const yearlySpending = MONTHS.map((_, index) => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return (
        date.getMonth() === index &&
        date.getFullYear() === currentYear &&
        (t.type === 'spend' || t.type === 'invest')
      );
    });
    
    return monthTransactions.reduce((sum, t) => sum + t.amount, 0);
  });

  const pieData = {
    labels: Object.keys(monthlySpending).map(tag => 
      tag.charAt(0).toUpperCase() + tag.slice(1)
    ),
    datasets: [
      {
        data: Object.values(monthlySpending),
        backgroundColor: Object.keys(monthlySpending).map(tag => 
          COLORS[tag as keyof typeof COLORS]
        ),
      },
    ],
  };

  const barData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: yearlySpending,
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(var(--foreground-rgb))',
        },
      },
      title: {
        display: true,
        text: 'Monthly Spending by Category',
        color: 'rgb(var(--foreground-rgb))',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(var(--foreground-rgb))',
        },
      },
      title: {
        display: true,
        text: 'Yearly Spending by Month',
        color: 'rgb(var(--foreground-rgb))',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(var(--foreground-rgb))',
        },
        grid: {
          color: 'rgba(var(--foreground-rgb), 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(var(--foreground-rgb))',
        },
        grid: {
          color: 'rgba(var(--foreground-rgb), 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Spending Overview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-md text-sm ${
              view === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView('yearly')}
            className={`px-4 py-2 rounded-md text-sm ${
              view === 'yearly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-[400px] flex items-center justify-center">
        {view === 'monthly' ? (
          <Pie data={pieData} options={pieOptions} />
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>
    </div>
  );
}