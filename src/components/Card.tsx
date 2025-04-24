import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  isLoading?: boolean;
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer,
  noPadding = false,
  isLoading = false,
}: CardProps) {
  const content = isLoading ? (
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  ) : (
    <>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold text-card-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      <div className={!noPadding ? 'p-6' : undefined}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-border px-6 py-4">
          {footer}
        </div>
      )}
    </>
  );

  return (
    <div className={`
      bg-card text-card-foreground rounded-lg shadow-sm
      dark:shadow-none border border-border
      transition-all duration-200
      hover:shadow-md dark:hover:shadow-none
      ${className}
    `.trim()}>
      {content}
    </div>
  );
}

// Subcomponents for better organization
Card.Header = function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 border-b border-border ${className}`}>
      {children}
    </div>
  );
};

Card.Content = function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-border px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

// Variants for different card styles
export const cardVariants = {
  default: 'bg-card',
  muted: 'bg-muted',
  primary: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};