import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useLoading } from '../context/LoadingContext';
import { Navbar } from './Navbar';
import { FullScreenLoader } from './LoadingSpinner';
import { darkModeClass } from '../hooks/useDarkMode';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isNavigating } = useNavigation();
  const { isLoading, message } = useLoading();

  return (
    <div className={darkModeClass(
      "min-h-screen flex flex-col",
      "bg-background text-foreground",
      "bg-gray-900 text-gray-50"
    )}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Loading States */}
      {isNavigating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
      )}
      {isLoading && <FullScreenLoader message={message} />}

      {/* Toast Container (if using notifications) */}
      <div 
        id="toast-container"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2"
        role="log"
        aria-live="polite"
      />

      {/* Modal Container */}
      <div 
        id="modal-container"
        className="fixed z-50"
      />

      {/* Popover Container */}
      <div 
        id="popover-container"
        className="fixed z-40"
      />
    </div>
  );
}

/* Portal target for floating elements */
if (typeof document !== 'undefined') {
  ['toast', 'modal', 'popover'].forEach(id => {
    const container = document.getElementById(`${id}-container`);
    if (!container) {
      const elem = document.createElement('div');
      elem.id = `${id}-container`;
      document.body.appendChild(elem);
    }
  });
}