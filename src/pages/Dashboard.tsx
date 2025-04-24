import { useAuth, useUser } from '@clerk/clerk-react';
import { LoadingSkeleton } from '../components/LoadingSpinner';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Task, Budget, Transaction } from '../types/models';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingTest from '../components/test/LoadingTest';
import { useMongoDb } from '../hooks/useMongoDb';
import { getTasks, getBudgets, getTransactions } from '../lib/mongodb';
import TestFeatures from '../components/test/TestFeatures';

export default function Dashboard() {
  const { user } = useUser();
  const {
    execute: fetchTasks,
    data: tasks,
    isLoading: isLoadingTasks
  } = useMongoDb<Task>(getTasks);

  const {
    execute: fetchBudgets,
    data: budgets,
    isLoading: isLoadingBudgets
  } = useMongoDb<Budget>(getBudgets);

  const {
    execute: fetchTransactions,
    data: transactions,
    isLoading: isLoadingTransactions
  } = useMongoDb<Transaction>(getTransactions);

  const safeTasks = tasks || [];
  const safeBudgets = budgets || [];
  const safeTransactions = transactions || [];

  useEffect(() => {
    fetchTasks();
    fetchBudgets();
    fetchTransactions();
  }, [fetchTasks, fetchBudgets, fetchTransactions]);

  const totalIncome = safeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = safeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const completedTasks = safeTasks.filter(t => t.completed).length;
  const totalTasks = safeTasks.length;
  const taskCompletionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Test Features - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8">
          <TestFeatures />
        </div>
      )}

      {/* Welcome Section */}
      <section className="text-center md:text-left">
        <h1 className="text-4xl font-bold gradient-text">
          Welcome back, {user?.firstName || 'there'}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's an overview of your tasks and finances
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="hover-lift">
          <Card.Content>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Progress</p>
                <h3 className="text-2xl font-bold mt-2">
                  {completedTasks}/{totalTasks}
                </h3>
              </div>
              <Badge 
                variant={taskCompletionRate >= 80 ? 'success' : 'warning'}
                icon={taskCompletionRate >= 80 ? <CheckCircle size={14} /> : <Clock size={14} />}
              >
                {taskCompletionRate.toFixed(0)}%
              </Badge>
            </div>
            <div className="mt-4 w-full bg-secondary/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  taskCompletionRate >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </Card.Content>
        </Card>

        <Card className="hover-lift">
          <Card.Content>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Balance</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${balance.toFixed(2)}
                </h3>
              </div>
              <Badge 
                variant={balance >= 0 ? 'success' : 'danger'}
                icon={balance >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              >
                {balance >= 0 ? 'Positive' : 'Negative'}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Income:</span>{' '}
                <span className="font-medium text-green-600 dark:text-green-400">
                  ${totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Expenses:</span>{' '}
                <span className="font-medium text-red-600 dark:text-red-400">
                  ${totalExpenses.toFixed(2)}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="hover-lift">
          <Card.Content>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Status</p>
                <h3 className="text-2xl font-bold mt-2">
                  {safeBudgets.length} Categories
                </h3>
              </div>
              <Wallet className="text-primary" size={24} />
            </div>
            <div className="mt-4">
              {safeBudgets.slice(0, 2).map((budget) => (
                <div key={budget.id} className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">{budget.category}</span>
                  <Badge 
                    variant={
                      (budget.spent / budget.amount) > 0.9 ? 'danger' :
                      (budget.spent / budget.amount) > 0.7 ? 'warning' :
                      'success'
                    }
                    size="sm"
                  >
                    {((budget.spent / budget.amount) * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Recent Activities */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/tasks">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </Card.Header>
          <Card.Content>
            {isLoadingTasks ? (
              <LoadingSkeleton count={3} />
            ) : safeTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks yet</p>
            ) : (
              <div className="space-y-4">
                {safeTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {task.completed ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <Clock className="text-yellow-500" size={18} />
                      )}
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </div>
                    <Badge
                      variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Link to="/budget">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </Card.Header>
          <Card.Content>
            {isLoadingTransactions ? (
              <LoadingSkeleton count={3} />
            ) : safeTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {safeTransactions.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                    <Badge
                      variant={transaction.type === 'income' ? 'success' : 'danger'}
                      size="sm"
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}