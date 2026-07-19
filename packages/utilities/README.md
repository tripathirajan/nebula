# @nebula-lab/utilities

Framework-agnostic helpers — no React dependency, nothing in the workspace depends below this. Everything else (`hooks`, `primitives`, ...) may depend on this package.

## What's here

- `clamp(value, min, max)`
- `debounce(fn, wait)` / `throttle(fn, wait, { trailing? })` — cancelable, `debounce` also exposes `.flush()`
- `deepMerge(target, ...sources)` — recursive merge for plain objects (used for theme token layer composition)
- `isHTMLElement(value)` / `isFocusable(element)` — SSR-safe DOM type guards

## Import

```ts
import { clamp, debounce } from '@nebula-lab/utilities';
// or per-module subpath
import { clamp } from '@nebula-lab/utilities/clamp';
```
