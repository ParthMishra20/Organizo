import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved ? JSON.parse(saved) : prefersDark;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return {
    darkMode,
    toggleDarkMode: () => setDarkMode(!darkMode)
  };
}

// CSS classes for consistent dark mode styling
export const darkModeClass = (
  baseClasses: string,
  lightClasses: string,
  darkClasses: string
) => {
  return `${baseClasses} ${darkClasses} dark:${darkClasses}`;
};