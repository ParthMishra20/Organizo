import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { ObjectId } from 'mongodb';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import toast from 'react-hot-toast';
import { Task, getCollection } from '../lib/mongodb';

export default function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const tasksCollection = await getCollection('tasks');
      const tasksList = await tasksCollection
        .find({ userId: user.id })
        .sort({ date: -1 })
        .toArray();

      setTasks(tasksList as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (data: Omit<Task, '_id' | 'userId' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to create tasks');
      return;
    }

    try {
      const tasksCollection = await getCollection('tasks');
      const newTask = {
        ...data,
        userId: user.id,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await tasksCollection.insertOne(newTask);
      await fetchTasks();
      setIsModalOpen(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const toggleTaskCompletion = async (taskId: ObjectId) => {
    if (!user) return;

    const task = tasks.find(t => t._id?.toString() === taskId.toString());
    if (!task) return;

    try {
      const tasksCollection = await getCollection('tasks');
      await tasksCollection.updateOne(
        { _id: taskId, userId: user.id },
        {
          $set: {
            completed: !task.completed,
            updatedAt: new Date()
          }
        }
      );

      setTasks(tasks.map(t =>
        t._id?.toString() === taskId.toString() ? { ...t, completed: !t.completed } : t
      ));
      toast.success('Task status updated!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Scheduler</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Task
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task._id?.toString()}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
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
              <p className="mt-2 text-gray-600 dark:text-gray-400">{task.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(task.date), 'MMM dd, yyyy')}
                </span>
                <button
                  onClick={() => task._id && toggleTaskCompletion(task._id)}
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
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No tasks found. Create your first task!
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}