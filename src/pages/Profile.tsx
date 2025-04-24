import { useAuth, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserSettings {
  emailNotifications: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high';
  defaultBudgetView: 'monthly' | 'weekly';
}

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    defaultTaskPriority: 'medium',
    defaultBudgetView: 'monthly'
  });

  async function handleUpdateSettings(updates: Partial<UserSettings>) {
    try {
      setIsLoading(true);
      // TODO: Implement MongoDB update
      setSettings(prev => ({ ...prev, ...updates }));
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || 'Profile'}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.fullName || user.username || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Account Created</label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {new Date(user.createdAt || '').toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email Verification</label>
            <p className="mt-1">
              {user.primaryEmailAddress?.verification.status === 'verified' ? (
                <span className="text-green-600 dark:text-green-400">Verified</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Not verified</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about tasks and budgets</p>
            </div>
            <button
              onClick={() => handleUpdateSettings({ emailNotifications: !settings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Task Priority</label>
            <select
              value={settings.defaultTaskPriority}
              onChange={e => handleUpdateSettings({ defaultTaskPriority: e.target.value as UserSettings['defaultTaskPriority'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Budget View</label>
            <select
              value={settings.defaultBudgetView}
              onChange={e => handleUpdateSettings({ defaultBudgetView: e.target.value as UserSettings['defaultBudgetView'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}