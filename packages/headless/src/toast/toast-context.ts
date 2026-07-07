import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface ToastContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  /** Called by `ToastAction`/`ToastClose`, and by `Toast` itself on
   * pointer-enter, to pause the auto-dismiss countdown — moving the mouse
   * over a toast (to read it, or reach for its action button) shouldn't let
   * it vanish out from under the pointer. */
  pauseTimer: () => void;
  /** Resumes the auto-dismiss countdown with whatever time was left when it was paused (not a fresh full `duration`). */
  resumeTimer: () => void;
}

const TOAST_NAME = 'Toast';

/**
 * Scoped context factory for one `Toast` — mirrors every other compound
 * component's use of `createContextScope`, even though (unlike `Dialog`)
 * multiple `Toast`s are almost always mounted simultaneously side by side
 * inside one `ToastViewport`; scoping still matters so each one's
 * `ToastTitle`/`ToastAction`/etc. reads *its own* `Toast`'s state, never a
 * sibling's.
 */
const [createToastContext, createToastScope] = createContextScope(TOAST_NAME);
const [ToastProvider, useToastContext] = createToastContext<ToastContextValue>(TOAST_NAME);

/** Every consumer prop object accepts an optional internal `__scopeToast` prop threaded through by `createToastScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeToast?: Scope<ToastContextValue> };

export { TOAST_NAME, ToastProvider, useToastContext, createToastScope };
export type { ToastContextValue, ScopedProps };
