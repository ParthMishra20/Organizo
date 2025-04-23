import React from 'react';
import { darkModeClass } from '../hooks/useDarkMode';

interface NavSkeletonProps {
  itemCount?: number;
}

export default function NavSkeleton({ itemCount = 4 }: NavSkeletonProps) {
  return (
    <div className="flex items-center space-x-6">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div
          key={i}
          className={darkModeClass(
            "flex items-center space-x-2 px-3 py-2 rounded-md animate-pulse",
            "bg-gray-50",
            "bg-gray-800"
          )}
        >
          {/* Icon placeholder */}
          <div
            className={darkModeClass(
              "w-5 h-5 rounded",
              "bg-gray-200",
              "bg-gray-700"
            )}
          />
          {/* Main text placeholder */}
          <div className="flex flex-col space-y-1">
            <div
              className={darkModeClass(
              "h-4 rounded",
                "bg-gray-200",
                "bg-gray-700"
              )}
              style={{ width: `${Math.random() * 40 + 60}px`, height: '16px' }}
            />
            {/* Description text placeholder */}
            <div
              className={darkModeClass(
                "h-3 rounded",
                "bg-gray-200/50",
                "bg-gray-700/50"
              )}
              style={{ width: `${Math.random() * 60 + 80}px` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserButtonSkeleton() {
  return (
    <div
      className={darkModeClass(
        "w-10 h-10 rounded-full animate-pulse ring-2 transition-transform",
        "bg-gray-200 ring-gray-200",
        "bg-gray-700 ring-gray-700"
      )}
    />
  );
}