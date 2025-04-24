export class MongoDBError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'MongoDBError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export function handleMongoError(error: any): Error {
  if (error.name === 'MongoServerError') {
    switch (error.code) {
      case 11000:
        return new ValidationError('Duplicate entry', error.keyPattern?.[0]);
      default:
        return new MongoDBError('Database error occurred', error.code?.toString());
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('An unexpected error occurred');
}

export function formatErrorMessage(error: Error): string {
  switch (error.constructor) {
    case AuthenticationError:
      return 'Please sign in to continue';
    case ValidationError:
      return `Invalid input: ${error.message}`;
    case NotFoundError:
      return error.message;
    case MongoDBError:
      return 'Database error occurred. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}