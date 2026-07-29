# `@nebula-lab/utilities` — API Reference

Generated from the actual TypeScript source (real exported prop/parameter names and types, not hand-transcribed) — regenerate with `node scripts/generate-api-docs.mjs` after adding/changing a component so this doesn't drift. See `ARCHITECTURE.md` at the repo root for how this package fits into the overall layering, and this package's own `README.md` for install/usage.

Cross-package prop types (e.g. a `react-ui` component's Props extending a `styleless` one) are shown as `extends `Type` (from `@nebula-lab/other-package`)` rather than flattened in place — look up that type in the other package's own API_DOC.md. Inherited native DOM attributes (from `PrimitivePropsWithRef`/`PolymorphicComponentPropsWithRef`) are summarized as a single note rather than enumerated, since they're just the target element's standard attributes.

---

## `@nebula-lab/utilities`

Framework-agnostic helper functions — no React, no DOM dependency beyond what a couple of DOM-predicate helpers need.

| SN | Component | Props | Usage notes | Comments |
|---|---|---|---|---|
| 1 | `clamp` | `value: number` — The number to restrict.<br>`min: number` — The lower bound (inclusive).<br>`max: number` — The upper bound (inclusive).<br>**returns** `number` — `value`, or the nearest bound if `value` is outside `[min, max]`. | Restricts `value` to the inclusive range `[min, max]`. |  |
| 2 | `debounce` | `fn: (...args: Args) => void` — The function to debounce.<br>`wait: unknown` — Milliseconds of inactivity required before `fn` runs.<br>**returns** `DebouncedFunction<Args>` — A debounced function with extra `.cancel()` and `.flush()` methods. | Returns a debounced wrapper around `fn` that only runs after `wait`ms have elapsed since the last call. |  |
| 3 | `deepMerge` | `target: T` — The base object.<br>`sources: Array<Partial<T>>` — Any number of partial overrides, applied in order (later wins on conflicting leaf keys).<br>**returns** `T` — A new object — `target` and every source are left untouched. | Recursively merges plain objects, later sources overriding earlier ones. |  |
| 4 | `isFocusable` | `element: unknown` — Anything — typically a `querySelectorAll` result or an event target.<br>**returns** `element is HTMLElement` — Whether `element` is a real, currently-focusable `HTMLElement`. | Whether `element` is keyboard-focusable — used by `FocusScope`/focus-trap style behavior to find the first/last focusable descendant. |  |
| 5 | `isHtmlElement` | — | (function declaration not found) |  |
| 6 | `throttle` | `fn: (...args: Args) => void` — The function to throttle.<br>`wait: unknown` — Minimum milliseconds between calls to `fn`.<br>`trailing?: boolean` — Also invoke `fn` once with the last-seen args when the throttling window closes, if a call was suppressed during it.<br>**returns** `ThrottledFunction<Args>` — A throttled function with an extra `.cancel()` method. | Returns a throttled wrapper around `fn` that runs at most once per `wait`ms. |  |

