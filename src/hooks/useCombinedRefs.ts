import { useCallback } from 'react';
import type { RefCallback } from 'react';

export function useCombinedRefs<T>(...refs: Array<RefCallback<T> | React.RefObject<T> | null>) {
  return useCallback((element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      // Handle callback refs
      if (typeof ref === 'function') {
        ref(element);
      }
      // Handle object refs
      else {
        (ref as React.MutableRefObject<T | null>).current = element;
      }
    });
  }, [refs]);
}