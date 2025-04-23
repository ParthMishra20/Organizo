import React from 'react';
import { Menu, X, Moon, Sun, Home, User, Calendar, Wallet } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { darkModeClass } from '../hooks/useDarkMode';

const navigationItems = [
  { path: '/', label: 'Home', icon: <Home size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  { path: '/tasks', label: 'Tasks', icon: <Calendar size={20} /> },
  { path: '/budget', label: 'Budget', icon: <Wallet size={20} /> },
];

export default function Navbar() {
  const { currentPath, navigate, isMobileMenuOpen, toggleMobileMenu } = useNavigation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={darkModeClass(
      "sticky top-0 z-40 w-full border-b",
      "bg-background border-gray-200",
      "bg-gray-900 border-gray-800"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold tracking-tight hover:opacity-80"
            >
              Organizo
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={darkModeClass(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  currentPath === path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 hover:text-gray-900",
                  currentPath === path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-800 hover:text-gray-50"
                )}
              >
                {icon}
                <span className="ml-2">{label}</span>
              </button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={darkModeClass(
                "p-2 rounded-md transition-colors",
                "hover:bg-gray-100",
                "hover:bg-gray-800"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className={darkModeClass(
            "px-2 pt-2 pb-3 space-y-1",
            "bg-background",
            "bg-gray-900"
          )}>
            {navigationItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  toggleMobileMenu();
                }}
                className={darkModeClass(
                  "flex w-full items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  currentPath === path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 hover:text-gray-900",
                  currentPath === path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-800 hover:text-gray-50"
                )}
              >
                {icon}
                <span className="ml-2">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}