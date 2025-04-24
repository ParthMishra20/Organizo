import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import Button from '../Button';
import Card from '../Card';

export default function LoadingTest() {
  const { startLoading, stopLoading } = useLoading();

  const simulateLoading = async () => {
    startLoading('Simulating a long running operation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    stopLoading();
  };

  const simulateError = async () => {
    startLoading('This operation will fail...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    stopLoading();
    throw new Error('Test error message');
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold">Loading States Test</h2>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Test various loading states and error handling
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={simulateLoading}
              variant="primary"
            >
              Test Loading
            </Button>
            <Button
              onClick={simulateError}
              variant="danger"
            >
              Test Error
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

// Usage example in the Dashboard:
// <LoadingTest />