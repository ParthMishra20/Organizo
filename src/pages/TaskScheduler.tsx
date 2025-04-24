import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Task['priority'];
  category: string;
}

export default function TaskScheduler() {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  async function fetchTasks() {
    try {
      setIsLoading(true);
      // TODO: Implement MongoDB fetch
      // For now using mock data
      setTasks([
        {
          _id: '1',
          title: 'Complete project',
          description: 'Finish the dashboard implementation',
          dueDate: '2024-04-24',
          priority: 'high',
          completed: false,
          category: 'Work'
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: Implement MongoDB insert
      const newTask: Task = {
        _id: Date.now().toString(),
        ...formData,
        completed: false
      };
      setTasks(prev => [...prev, newTask]);
      setIsAddingTask(false);
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        category: ''
      });
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    }
  }

  async function toggleTaskComplete(taskId: string) {
    try {
      // TODO: Implement MongoDB update
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Scheduler</h1>
        <button
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Task
        </button>
      </div>

      {isAddingTask && (
        <form onSubmit={handleAddTask} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <div
            key={task._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskComplete(task._id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div>
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}