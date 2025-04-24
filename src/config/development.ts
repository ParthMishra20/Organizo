// Feature flags for development environment
export const DEV_CONFIG = {
  // Enable/disable test features
  enableTestFeatures: true,
  
  // Simulated delays for testing loading states (in ms)
  delays: {
    api: 1000,
    loading: 2000,
    longOperation: 3000,
  },

  // Test data for development
  mockData: {
    tasks: [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'This is a test task',
        completed: false,
        priority: 'high' as const,
        dueDate: '2024-04-25',
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Another test task',
        completed: true,
        priority: 'medium' as const,
        dueDate: '2024-04-26',
      },
    ],
    budgets: [
      {
        id: '1',
        category: 'Test Budget',
        amount: 1000,
        spent: 500,
      },
    ],
  },

  // Error simulation settings
  errorSimulation: {
    // Probability of simulating an error (0-1)
    probability: 0.2,
    // Types of errors to simulate
    types: [
      'network',
      'validation',
      'authentication',
      'notFound',
      'server',
    ] as const,
  },

  // Development tools
  tools: {
    // Enable console logging of actions
    enableActionLogging: true,
    // Enable performance monitoring
    enablePerformanceMonitoring: true,
    // Enable state logging
    enableStateLogging: true,
  },

  // Toast notification settings for development
  toastSettings: {
    // Show more detailed error messages
    verboseErrors: true,
    // Longer duration for error messages
    errorDuration: 6000,
    // Show technical details in errors
    showTechnicalDetails: true,
  },
};

// Utility function to simulate API delay
export const simulateDelay = (ms = DEV_CONFIG.delays.api) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Utility function to simulate API error
export const simulateError = (probability = DEV_CONFIG.errorSimulation.probability) => {
  if (Math.random() < probability) {
    const errorTypes = DEV_CONFIG.errorSimulation.types;
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    
    switch (errorType) {
      case 'network':
        throw new Error('Network error: Failed to fetch');
      case 'validation':
        throw new Error('Validation error: Invalid input');
      case 'authentication':
        throw new Error('Authentication error: Session expired');
      case 'notFound':
        throw new Error('Not found: Resource does not exist');
      case 'server':
        throw new Error('Server error: Internal server error');
      default:
        throw new Error('Unknown error occurred');
    }
  }
};

// Development-only logging utility
export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development' && DEV_CONFIG.tools.enableActionLogging) {
    console.log('[DEV]', ...args);
  }
};

// Type guard for development environment
export const isDevelopment = () => process.env.NODE_ENV === 'development';