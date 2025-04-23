import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Run cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock Selection API
const mockRange = {
  commonAncestorContainer: document.createElement('div'),
  startContainer: document.createElement('div'),
  endContainer: document.createElement('div'),
  startOffset: 0,
  endOffset: 0,
  collapsed: false,
  cloneRange: function() { return Object.create(this); },
  cloneContents: () => document.createDocumentFragment(),
  getBoundingClientRect: () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({})
  }),
  selectNodeContents: vi.fn(),
  setEnd: vi.fn(),
  setStart: vi.fn(),
};

const mockSelection = {
  rangeCount: 1,
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
  getRangeAt: vi.fn(() => mockRange),
  toString: vi.fn(() => ''),
};

Object.defineProperty(window, 'getSelection', {
  value: vi.fn(() => mockSelection),
});

// Mock execCommand
document.execCommand = vi.fn(() => true);
document.queryCommandState = vi.fn(() => false);
document.queryCommandValue = vi.fn(() => '');

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = MockResizeObserver as any;

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [0];
  takeRecords = vi.fn(() => []);
}

window.IntersectionObserver = MockIntersectionObserver as any;

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  },
  configurable: true,
});

// Mock URL API
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock DataTransfer
class MockDataTransfer {
  data: Record<string, string> = {};
  dropEffect = 'none';
  effectAllowed = 'all';
  files: never[] = [];
  items: never[] = [];
  types: string[] = [];

  setData(format: string, data: string): void {
    this.data[format] = data;
    this.types = Object.keys(this.data);
  }

  getData(format: string): string {
    return this.data[format] || '';
  }

  clearData(format?: string): void {
    if (format) {
      delete this.data[format];
    } else {
      this.data = {};
    }
    this.types = Object.keys(this.data);
  }
}

// Mock ClipboardEvent
class MockClipboardEvent extends Event {
  clipboardData: MockDataTransfer;

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict);
    this.clipboardData = new MockDataTransfer();
  }
}

Object.defineProperty(window, 'ClipboardEvent', {
  value: MockClipboardEvent,
});

// Mock storage
const createStorageMock = () => ({
  length: 0,
  clear: vi.fn(),
  getItem: vi.fn(),
  key: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
});

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
});

// Custom matchers
expect.extend({
  toHaveBeenCalledOnce(received: any) {
    const pass = received.mock.calls.length === 1;
    return {
      message: () =>
        `expected ${received} to have been called exactly once but was called ${
          received.mock.calls.length
        } time(s)`,
      pass,
    };
  },
});