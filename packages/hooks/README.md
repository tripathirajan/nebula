# @nebula-lab/hooks

React hooks with no dependency on `@nebula-lab/primitives` or any higher layer — state, DOM, and lifecycle utilities every other package can build on.

## What's here

- `useControllableState` — the controlled/uncontrolled state pattern used by every stateful primitive (`Checkbox`, `Select`, `Tabs`, `Switch`, ...).
- `useClickOutside`, `useMediaQuery`, `useScrollLock`, `useFocusTrap` — overlay/responsive building blocks.
- `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver` — DOM observation.
- `useLocalStorage`, `useDebounce`, `useId` — state/value utilities.
- `useBoolean`, `useToggle`, `useStableCallback`, `useEventListener`, `usePrevious`, `useMounted` — small general-purpose hooks.

## Import

```ts
import { useControllableState, useBoolean } from '@nebula-lab/hooks';
// or per-hook subpath
import { useControllableState } from '@nebula-lab/hooks/use-controllable-state';
```

## Note on `@nebula-lab/utilities`

This package intentionally does not import from `@nebula-lab/utilities` (see `component-library-architecture.md` §2: both packages sit at the bottom of the dependency graph with no cross-dependency). Where a hook needs logic that overlaps with a utility (e.g. `useFocusTrap`'s focusable-element query vs. `isFocusable`), it's duplicated locally with a comment pointing at the utilities equivalent rather than creating a cross-import.
