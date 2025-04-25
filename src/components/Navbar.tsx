'use client';

import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';
import Image from 'next/image';

export default function Navbar() {
  const { isLoaded, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo and site title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.jpg"
                  alt="Organizo Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Organizo
              </span>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/task-manager"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Task Manager
              </Link>
              <Link 
                href="/budget-buddy"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Budget Buddy
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Auth button */}
            {isLoaded && (
              <div>
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                ) : (
                  <UserButton afterSignOutUrl="/" />
                )}
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}