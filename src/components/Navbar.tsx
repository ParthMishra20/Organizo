import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LayoutDashboard, Calendar, Wallet, User } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { signOut } from '../lib/supabase';

interface NavbarProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Organizo
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/scheduler"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  <Calendar size={20} />
                  <span>Task Scheduler</span>
                </NavLink>
                <NavLink
                  to="/budget"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  <Wallet size={20} />
                  <span>Budget Buddy</span>
                </NavLink>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {toggleDarkMode && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`
                  }
                >
                  <User size={20} />
                  <span>{user.email?.split('@')[0] || 'Profile'}</span>
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <NavLink
                to="/sign-in"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}