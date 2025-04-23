import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

interface TestConfig {
  globals: boolean;
  environment: string;
  setupFiles: string[];
  include: string[];
  exclude: string[];
  coverage: {
    provider: string;
    reporter: string[];
    reportsDirectory: string;
    exclude: string[];
  };
  css: boolean;
  deps: {
    inline: string[];
  };
}

interface ExtendedUserConfig {
  plugins: any[];
  resolve: {
    alias: {
      [key: string]: string;
    };
  };
  define: {
    [key: string]: any;
  };
  test: TestConfig;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'coverage',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__mocks__/*',
        '**/test/**',
        'test/**',
        '**/*.config.*',
      ],
    },
    css: false,
    deps: {
      inline: [
        '@testing-library/user-event',
        '@testing-library/react',
      ],
    },
  },
} as ExtendedUserConfig);