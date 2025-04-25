'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import type { Task } from '@/utils/supabase';

interface TaskListProps {
  tasks: Task[];
  showCompleted?: boolean;
}

export default function TaskList({ tasks, showCompleted = false }: TaskListProps) {
  const router = useRouter();
  const { user } = useUser();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleComplete = async (taskId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: true })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!user || !confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !editingTask) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          name: formData.get('name'),
          date: formData.get('date'),
          time: formData.get('time'),
          priority: formData.get('priority'),
        })
        .eq('id', editingTask.id)
        .eq('user_id', user.id);

      if (error) throw error;
      setEditingTask(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {showCompleted ? 'No completed tasks' : 'No tasks found'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        >
          {editingTask?.id === task.id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                defaultValue={task.name}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  defaultValue={task.date}
                  required
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="time"
                  name="time"
                  defaultValue={task.time}
                  required
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <select
                name="priority"
                defaultValue={task.priority}
                required
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {task.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.date} at {task.time}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {task.priority}
                </span>
                {!showCompleted && (
                  <>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="p-1 text-green-500 hover:text-green-700"
                    >
                      <FiCheck size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}