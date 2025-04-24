import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { useLoading } from '../../context/LoadingContext';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../../utils/toast';
import { AuthenticationError, ValidationError, NotFoundError } from '../../lib/errors';

export default function TestFeatures() {
  const { startLoading, stopLoading } = useLoading();

  const testLoading = async () => {
    startLoading('Testing loading state...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    stopLoading();
    showSuccessToast('Loading test completed!');
  };

  const testToasts = () => {
    showSuccessToast('This is a success message');
    setTimeout(() => showErrorToast('This is an error message'), 1000);
    setTimeout(() => showWarningToast('This is a warning message'), 2000);
    setTimeout(() => showInfoToast('This is an info message'), 3000);
  };

  const testErrors = () => {
    const errors = [
      new AuthenticationError('You need to be logged in'),
      new ValidationError('Invalid email format', 'email'),
      new NotFoundError('User'),
      new Error('Generic error message')
    ];

    errors.forEach((error, index) => {
      setTimeout(() => showErrorToast(error), index * 1500);
    });
  };

  const testLoadingOverlay = async () => {
    startLoading('Performing a long operation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    stopLoading();
    showSuccessToast('Long operation completed!');
  };

  const testErrorBoundary = () => {
    throw new Error('Test error boundary');
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Test Features</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={testLoading}
              variant="primary"
            >
              Test Loading State
            </Button>
            
            <Button
              onClick={testToasts}
              variant="secondary"
            >
              Test Toast Messages
            </Button>
            
            <Button
              onClick={testErrors}
              variant="danger"
            >
              Test Error Handling
            </Button>
            
            <Button
              onClick={testLoadingOverlay}
              variant="primary"
            >
              Test Loading Overlay
            </Button>
            
            <Button
              onClick={testErrorBoundary}
              variant="danger"
            >
              Test Error Boundary
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click each button to test different features</li>
              <li>Loading State: Shows loading spinner in components</li>
              <li>Toast Messages: Displays different types of notifications</li>
              <li>Error Handling: Tests error formatting and display</li>
              <li>Loading Overlay: Shows full-screen loading state</li>
              <li>Error Boundary: Tests error recovery UI</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}