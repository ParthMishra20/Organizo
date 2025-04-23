import { useState, useEffect, useCallback } from 'react';

export interface DarkModeOptions {
  storageKey?: string;
  defaultValue?: boolean;
  onChange?: (isDark: boolean) => void;
}

export interface DarkModeReturn {
  darkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  reset: () => void;
  isDark: boolean;
  isLight: boolean;
}

export function useDarkMode({
  storageKey = 'darkMode',
  defaultValue = false,
  onChange
}: DarkModeOptions = {}): DarkModeReturn {
  // Initialize state from localStorage or system preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const savedValue = localStorage.getItem(storageKey);
    if (savedValue !== null) {
      return JSON.parse(savedValue);
    }
    
    // If no saved preference, check system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return defaultValue;
  });

  // Update body class and localStorage when darkMode changes
  useEffect(() => {
    // Update document class
    document.documentElement.classList.toggle('dark', darkMode);
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(darkMode));
    
    // Call onChange callback if provided
    onChange?.(darkMode);
  }, [darkMode, storageKey, onChange]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if there's no saved preference
      if (localStorage.getItem(storageKey) === null) {
        setDarkMode(e.matches);
      }
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storageKey]);

  // Toggle function
  const toggle = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Enable function
  const enable = useCallback(() => {
    setDarkMode(true);
  }, []);

  // Disable function
  const disable = useCallback(() => {
    setDarkMode(false);
  }, []);

  // Reset to system preference
  const reset = useCallback(() => {
    localStorage.removeItem(storageKey);
    if (window.matchMedia) {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setDarkMode(defaultValue);
    }
  }, [storageKey, defaultValue]);

  return {
    darkMode,
    toggle,
    enable,
    disable,
    reset,
    isDark: darkMode,
    isLight: !darkMode
  };
}

/**
 * Helper function to generate dark mode class names
 */
export function darkModeClass(
  baseClasses: string,
  lightClasses: string,
  darkClasses: string
): string {
  return `${baseClasses} ${lightClasses} dark:${darkClasses}`;
}