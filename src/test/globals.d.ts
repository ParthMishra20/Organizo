/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  // Add test runner functions to global scope
  const describe: typeof import('vitest').describe;
  const test: typeof import('vitest').test;
  const it: typeof import('vitest').it;
  const expect: typeof import('vitest').expect;
  const beforeAll: typeof import('vitest').beforeAll;
  const afterAll: typeof import('vitest').afterAll;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  const vi: typeof import('vitest').vi;

  // Extend Window interface
  interface Window {
    ResizeObserver: {
      new(callback: ResizeObserverCallback): ResizeObserver;
      prototype: ResizeObserver;
    };
    IntersectionObserver: {
      new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
      prototype: IntersectionObserver;
    };
  }

  // Custom matchers
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveAttribute(attr: string, value?: string): void;
      toHaveClass(...classNames: string[]): void;
      toHaveValue(value: string | string[] | number): void;
      toBeVisible(): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toHaveFocus(): void;
      toBeChecked(): void;
      toBePartiallyChecked(): void;
      toBeEmpty(): void;
      toBeEmptyDOMElement(): void;
      toBeInvalid(): void;
      toBeRequired(): void;
      toBeValid(): void;
      toContainElement(element: HTMLElement | null): void;
      toContainHTML(html: string): void;
      toHaveTextContent(text: string | RegExp): void;
      toHaveLength(length: number): void;
      toHaveBeenCalledOnce(): void;
      toBeInTheDOM(): void;
      toHaveStyle(css: string | Partial<CSSStyleDeclaration>): void;
    }

    interface ExpectStatic {
      extend(matchers: Record<string, any>): void;
    }
  }

  // Mock types
  interface MockFunctionResult<T = any> {
    type: 'return' | 'throw';
    value: T;
  }

  interface MockContext<TArgs extends any[] = any[], TReturns = any> {
    calls: TArgs[];
    results: MockFunctionResult<TReturns>[];
    instances: any[];
    lastCall: TArgs;
    contexts: any[];
  }

  interface MockFunction<TArgs extends any[] = any[], TReturns = any> {
    (...args: TArgs): TReturns;
    getMockName(): string;
    mock: MockContext<TArgs, TReturns>;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): this;
    mockImplementation(fn: (...args: TArgs) => TReturns): this;
    mockImplementationOnce(fn: (...args: TArgs) => TReturns): this;
    mockName(name: string): this;
    mockReturnThis(): this;
    mockReturnValue(value: TReturns): this;
    mockReturnValueOnce(value: TReturns): this;
    mockResolvedValue<T = TReturns>(value: Awaited<T>): this;
    mockResolvedValueOnce<T = TReturns>(value: Awaited<T>): this;
    mockRejectedValue(value: any): this;
    mockRejectedValueOnce(value: any): this;
  }
}

// Augment the testing-library types
declare module '@testing-library/dom' {
  interface Queries {
    getByLabelText(text: string | RegExp): HTMLElement;
    getByText(text: string | RegExp): HTMLElement;
    getByRole(role: string, options?: { hidden?: boolean }): HTMLElement;
    getAllByRole(role: string): HTMLElement[];
  }
}

export {};
