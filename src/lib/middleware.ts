import { handleError, showWarning } from './error-handler';

// Configuration
const MAX_RETRIES = 3;
const MIN_DELAY = 1000; // 1 second
const MAX_DELAY = 5000; // 5 seconds

// Retry counter for each operation type
const retryCounters = new Map<string, number>();

/**
 * Executes an operation with retry logic using exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName = 'default'
): Promise<T> {
  try {
    const result = await operation();
    // Reset retry counter on success
    retryCounters.delete(operationName);
    return result;
  } catch (error) {
    const retryCount = retryCounters.get(operationName) || 0;

    if (retryCount < MAX_RETRIES) {
      // Increment retry counter
      retryCounters.set(operationName, retryCount + 1);

      // Calculate delay with exponential backoff
      const delay = Math.min(MIN_DELAY * Math.pow(2, retryCount), MAX_DELAY);
      
      showWarning(`Operation failed. Retrying in ${delay/1000} seconds... (${retryCount + 1}/${MAX_RETRIES})`);
      console.log(`Retrying ${operationName} in ${delay}ms (attempt ${retryCount + 1})`);
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the operation
      return withRetry(operation, operationName);
    }

    // Reset retry counter after max retries
    retryCounters.delete(operationName);
    throw error;
  }
}

/**
 * Combines error handling and retry logic for database operations
 */
export async function withDatabaseOperation<T>(
  operation: () => Promise<T>,
  operationName?: string
): Promise<T> {
  try {
    return await withRetry(operation, operationName);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Type guard for checking if a value is a Promise
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return value && typeof value.then === 'function';
}

/**
 * Wraps a function to add error handling and retry logic
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    retry?: boolean;
    operationName?: string;
  } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };
}