import React from 'react';
import { useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { TRANSITIONS, combineAnimations } from '../utils/animations';
import { getRouteMetadata } from '../config/routes';

interface PageHeaderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  icon: CustomIcon,
  actions,
  className = ''
}: PageHeaderProps) {
  const location = useLocation();
  const routeInfo = getRouteMetadata(location.pathname);

  // Use provided props or fall back to route metadata
  const Icon = CustomIcon || routeInfo?.icon;
  const headerTitle = title || routeInfo?.label;
  const headerDescription = description || routeInfo?.description;

  if (!headerTitle) return null;

  return (
    <div className={combineAnimations(
      "mb-6 flex items-start justify-between gap-4",
      TRANSITIONS.default,
      className
    )}>
      <div>
        <h1 className={combineAnimations(
          "flex items-center space-x-3 text-2xl font-bold",
          TRANSITIONS.default
        )}>
          {Icon && (
            <Icon 
              size={28} 
              className={darkModeClass(
                "transition-colors",
                "text-indigo-600",
                "text-indigo-400"
              )} 
            />
          )}
          <span>{headerTitle}</span>
        </h1>
        {headerDescription && (
          <p className={darkModeClass(
            "mt-1 text-sm",
            "text-gray-600",
            "text-gray-400"
          )}>
            {headerDescription}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
}

interface PageActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function PageActions({ children, className = '' }: PageActionsProps) {
  return (
    <div className={combineAnimations(
      "flex items-center space-x-3",
      TRANSITIONS.default,
      className
    )}>
      {children}
    </div>
  );
}

/*
Example usage:

function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Custom Title"  // Optional: overrides route metadata
        description="Custom description"  // Optional: overrides route metadata
        icon={CustomIcon}  // Optional: overrides route metadata
        actions={
          <PageActions>
            <button>Action 1</button>
            <button>Action 2</button>
          </PageActions>
        }
      />
      <PageWrapper>
        Content goes here...
      </PageWrapper>
    </>
  );
}
*/