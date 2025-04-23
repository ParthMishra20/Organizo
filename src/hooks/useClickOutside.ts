import { useEffect, RefObject } from 'react';

interface UseClickOutsideOptions {
  enabled?: boolean;
  capture?: boolean;
}

export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, capture = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const refsArray = Array.isArray(refs) ? refs : [refs];

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click was inside any of the referenced elements
      const isInside = refsArray.some(ref => {
        const el = ref.current;
        if (!el) return false;

        return el.contains(event.target as Node);
      });

      if (!isInside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, capture);
    document.addEventListener('touchstart', handleClickOutside, capture);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, capture);
      document.removeEventListener('touchstart', handleClickOutside, capture);
    };
  }, [refs, handler, enabled, capture]);
}

/* Example usage:
function Component() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // Single ref
  useClickOutside(ref1, () => {
    console.log('Clicked outside ref1');
  });

  // Multiple refs
  useClickOutside([ref1, ref2], () => {
    console.log('Clicked outside both ref1 and ref2');
  });

  // With options
  useClickOutside(ref1, () => {
    console.log('Clicked outside with options');
  }, {
    enabled: isEnabled,
    capture: true
  });

  return (
    <div>
      <div ref={ref1}>Click outside me</div>
      <div ref={ref2}>Or me</div>
    </div>
  );
}
*/