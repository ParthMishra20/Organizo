/**
 * Combines class names and filters out falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Combines animation classes with tailwind classes
 */
export function combineAnimations(...classes: (string | boolean | undefined | null)[]): string {
  return cn(...classes);
}