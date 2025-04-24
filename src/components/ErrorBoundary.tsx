import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';
import Button from './Button';
import { showErrorToast } from '../utils/toast';
import { formatErrorMessage } from '../lib/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorMessage = formatErrorMessage(error);
    console.error('Uncaught error:', error, errorInfo);
    showErrorToast(errorMessage, { duration: 6000 });

    // You could also send to an error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
      console.log('Would send to error reporting service:', {
        error,
        errorInfo,
        timestamp: new Date().toISOString(),
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4">
            <Card>
              <Card.Content className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Something went wrong
                  </h2>
                  <p className="text-muted-foreground">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {this.state.error?.stack}
                </pre>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      showErrorToast('Going back...', { duration: 2000 });
                      window.history.back();
                    }}
                  >
                    Go Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      showErrorToast('Reloading...', { duration: 2000 });
                      window.location.reload();
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;