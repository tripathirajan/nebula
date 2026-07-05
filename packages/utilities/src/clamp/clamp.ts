/**
 * Restricts `value` to the inclusive range `[min, max]`. Swaps `min`/`max`
 * internally if they're passed in the wrong order rather than returning NaN.
 *
 * @param value - The number to restrict.
 * @param min - The lower bound (inclusive).
 * @param max - The upper bound (inclusive).
 * @returns `value`, or the nearest bound if `value` is outside `[min, max]`.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10); // -> 5
 * clamp(-2, 0, 10); // -> 0
 * clamp(99, 0, 10); // -> 10
 * ```
 */
function clamp(value: number, min: number, max: number): number {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(value, lower), upper);
}

export { clamp };
