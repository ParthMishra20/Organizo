import React from 'react';
import { useAuth } from '../components/AuthProvider';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.email?.split('@')[0] || 'User Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Account ID</label>
              <p className="mt-1 text-gray-900 dark:text-white">{user.id}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email Verification</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {user.email_confirmed_at ? (
                  <span className="text-green-600 dark:text-green-400">Verified</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Not verified</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Account Created</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}