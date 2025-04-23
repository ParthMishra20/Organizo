import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Home, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error tracking service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <AlertOctagon className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || 'An unexpected error occurred'}
          </p>
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <pre className="mt-4 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-h-48">
              {error.stack}
            </pre>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 rounded-md 
                     bg-primary text-primary-foreground hover:bg-primary/90
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-4 py-2 rounded-md 
                     bg-secondary text-secondary-foreground hover:bg-secondary/90
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-secondary transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <p className="mt-8 text-xs text-center text-muted-foreground">
            This error message is only displayed during development.
            <br />
            Production builds will show a user-friendly error message.
          </p>
        )}
      </div>
    </div>
  );
}