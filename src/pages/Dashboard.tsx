import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      toast.error('Failed to fetch tasks');
      return;
    }

    setTasks(data || []);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update task');
      return;
    }

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    toast.success('Task status updated!');
  };

  const todayTasks = tasks.filter(
    task => task.date === format(new Date(), 'yyyy-MM-dd')
  );

  const TaskCard = ({ task, expanded = false }: { task: Task; expanded?: boolean }) => (
    <div
      className={`p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
        expanded
          ? 'bg-indigo-50 dark:bg-indigo-900 scale-105'
          : 'bg-white dark:bg-gray-800 hover:scale-102'
      }`}
      onClick={() => setSelectedTask(expanded ? null : task)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {task.name}
        </h3>
        <span
          className={`px-2 py-1 rounded text-sm ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}
        >
          {task.priority}
        </span>
      </div>
      <p className={`mt-2 text-gray-600 dark:text-gray-400 ${expanded ? 'text-base' : 'text-sm line-clamp-2'}`}>
        {task.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(task.date), 'MMM dd, yyyy')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskCompletion(task.id);
          }}
          className={`flex items-center ${
            task.completed
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {task.completed ? (
            <>
              <CheckCircle size={16} className="mr-1" />
              Completed
            </>
          ) : (
            <>
              <XCircle size={16} className="mr-1" />
              Not Completed
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Today's Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                expanded={selectedTask?.id === task.id}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 col-span-2 text-center py-8">
              No tasks scheduled for today
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          All Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                expanded={selectedTask?.id === task.id}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 col-span-2 text-center py-8">
              No tasks found. Create your first task in the Task Scheduler!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}