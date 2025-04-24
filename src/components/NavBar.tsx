import { useAuth } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, LayoutDashboard, Calendar, Wallet, User } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';

interface NavBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function NavBar({ darkMode, toggleDarkMode }: NavBarProps) {
  const { isSignedIn, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={darkModeClass(
      "sticky top-0 z-50 border-b backdrop-blur-sm bg-white/80 dark:bg-gray-900/80",
      "border-gray-200",
      "border-gray-800"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Organizo
            </Link>
            {isSignedIn && (
              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
                <NavLink to="/tasks" icon={<Calendar size={18} />}>Tasks</NavLink>
                <NavLink to="/budget" icon={<Wallet size={18} />}>Budget</NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500 transition-transform hover:rotate-45" />
              ) : (
                <Moon size={20} className="text-gray-600 transition-transform hover:-rotate-12" />
              )}
            </button>
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/profile" icon={<User size={18} />}>Profile</NavLink>
                <button
                  onClick={() => signOut()}
                  className={darkModeClass(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    "bg-indigo-600 text-white hover:bg-indigo-700",
                    "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className={darkModeClass(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  "bg-indigo-600 text-white hover:bg-indigo-700",
                  "bg-indigo-600 text-white hover:bg-indigo-700"
                )}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isSignedIn && (
        <div className="md:hidden border-t dark:border-gray-800">
          <div className="grid grid-cols-3 gap-1 p-2">
            <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</MobileNavLink>
            <MobileNavLink to="/tasks" icon={<Calendar size={18} />}>Tasks</MobileNavLink>
            <MobileNavLink to="/budget" icon={<Wallet size={18} />}>Budget</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className={`transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center space-y-1 px-2 py-3 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className={`transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}