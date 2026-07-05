type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively merges plain objects, later sources overriding earlier ones.
 * Arrays and non-plain-object values (class instances, Dates, etc.) are
 * replaced wholesale rather than merged — mirrors how `theme` token
 * overrides (primitive -> semantic -> component) are expected to compose.
 *
 * @param target - The base object.
 * @param sources - Any number of partial overrides, applied in order (later wins on conflicting leaf keys).
 * @returns A new object — `target` and every source are left untouched.
 *
 * @example
 * ```ts
 * deepMerge(
 *   { color: { bg: 'white', text: 'black' }, spacing: 4 },
 *   { color: { bg: 'black' } },
 * );
 * // -> { color: { bg: 'black', text: 'black' }, spacing: 4 }
 *
 * // Arrays replace wholesale rather than merging element-by-element:
 * deepMerge({ tags: ['a', 'b'] }, { tags: ['c'] }); // -> { tags: ['c'] }
 * ```
 */
function deepMerge<T extends PlainObject>(target: T, ...sources: Array<Partial<T>>): T {
  const result: PlainObject = { ...target };

  for (const source of sources) {
    if (!source) continue;

    for (const key of Object.keys(source)) {
      const sourceValue = (source as PlainObject)[key];
      const targetValue = result[key];

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result as T;
}

export { deepMerge, isPlainObject };
