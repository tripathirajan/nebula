import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

/**
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (resolves conflicting Tailwind utility classes, last one wins) — the single
 * class-name helper every `@nebula-lab/*` styled component should use instead of
 * hand-rolled string concatenation.
 *
 * @param inputs - Any number of class values: strings, falsy values (ignored), arrays, or `{ [className]: boolean }` objects — anything `clsx` accepts.
 * @returns A single deduplicated, conflict-resolved class string.
 *
 * @example
 * ```ts
 * cn('px-2 py-1', isActive && 'bg-blue-500', className);
 * // -> 'px-2 py-1 bg-blue-500 <whatever className was>'
 *
 * // Later classes win on genuine Tailwind conflicts, unlike plain clsx:
 * cn('px-2', 'px-4'); // -> 'px-4' (clsx alone would return 'px-2 px-4')
 * ```
 */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { cn };
