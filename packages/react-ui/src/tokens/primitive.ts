/**
 * Layer 1 — primitive tokens: raw numeric scales, no meaning attached yet.
 * Numeric scale keys (`500`, not `medium`) so intermediate values can be
 * inserted later without renaming anything downstream. Nothing in this file
 * should ever be referenced directly by a component — only `semantic.ts`
 * (and, for multi-variant components, `component.ts`) may reference these.
 */
const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const;

const blue = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
} as const;

const red = {
  50: '#fef2f2',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
} as const;

const green = {
  50: '#f0fdf4',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
} as const;

const amber = {
  50: '#fffbeb',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
} as const;

const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

const radius = {
  none: '0px',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
} as const;

/**
 * The full primitive token tree — raw scales only, grouped by category.
 *
 * @example
 * ```ts
 * import { primitiveTokens } from '@nebula/react-ui/tokens';
 *
 * // Only for use inside semantic.ts / component.ts — never import this
 * // directly into a component or story.
 * const brandBlue = primitiveTokens.color.blue[600];
 * ```
 */
const primitiveTokens = {
  color: { gray, blue, red, green, amber },
  spacing,
  radius,
  fontSize,
} as const;

export { primitiveTokens };
