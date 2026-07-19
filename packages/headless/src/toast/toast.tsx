import { useControllableState, useId } from '@nebula-lab/hooks';
import { Presence } from '@nebula-lab/primitives/presence';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { ToastProvider } from './toast-context';

import type { ScopedProps } from './toast-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface ToastProps extends PrimitivePropsWithRef<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** How long (ms) before the toast auto-dismisses itself. `Infinity` (or
   * any non-positive number) disables auto-dismiss entirely — useful for a
   * toast whose only dismissal should be an explicit `ToastAction`/
   * `ToastClose`. @default 5000 */
  duration?: number;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
}

/**
 * `role="status"` + `aria-live="polite"` + `aria-atomic="true"` — announces
 * itself to assistive tech without stealing focus or interrupting whatever
 * the user is doing (the WAI-ARIA "status message" pattern; a toast is
 * fundamentally a live region, not a dialog). Renders a plain `<div>`, not
 * an `<li>`: `role="status"` is an invalid role override for `<li>` (its
 * implicit role is `listitem`, and forcing a non-`listitem` role onto it
 * also invalidates the parent list — a real `aria-allowed-role`/`list`
 * violation, not a pedantic one), so `ToastViewport` renders as a labelled
 * `role="region"` rather than an `<ol>` to match.
 *
 * Unlike `Dialog`, there's no shared root managing "which toast is open" —
 * toasts are independent and usually several are visible simultaneously, so
 * each `Toast` instance owns its own `open` state and auto-dismiss timer.
 * The `duration` countdown pauses on pointer-enter (reading a toast, or
 * reaching for its action button, shouldn't race against it vanishing) and
 * resumes with whatever time was left, not a fresh full `duration`, on
 * pointer-leave.
 *
 * @example
 * ```tsx
 * <Toast duration={5000} onOpenChange={setOpen} open={open}>
 *   <ToastTitle>Upload complete</ToastTitle>
 *   <ToastDescription>report.pdf was uploaded successfully.</ToastDescription>
 *   <ToastAction altText="Undo the upload" onClick={undo}>Undo</ToastAction>
 *   <ToastClose aria-label="Dismiss">×</ToastClose>
 * </Toast>
 * ```
 */
const Toast = React.forwardRef<HTMLDivElement, ScopedProps<ToastProps>>((props, forwardedRef) => {
  const {
    __scopeToast,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    duration = 5000,
    forceMount = false,
    onPointerEnter,
    onPointerLeave,
    ...toastProps
  } = props;

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const titleId = useId('nebula-toast-title');
  const descriptionId = useId('nebula-toast-description');

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const remainingRef = React.useRef(duration);
  const startedAtRef = React.useRef(0);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const startTimer = React.useCallback(
    (delay: number) => {
      clearTimer();
      if (!Number.isFinite(delay) || delay <= 0) return;
      startedAtRef.current = Date.now();
      timerRef.current = setTimeout(() => setOpen(false), delay);
    },
    [clearTimer, setOpen],
  );

  const pauseTimer = React.useCallback(() => {
    if (timerRef.current === undefined) return;
    clearTimer();
    remainingRef.current -= Date.now() - startedAtRef.current;
  }, [clearTimer]);

  const resumeTimer = React.useCallback(() => {
    startTimer(remainingRef.current);
  }, [startTimer]);

  React.useEffect(() => {
    if (!open) {
      clearTimer();
      return;
    }
    remainingRef.current = duration;
    startTimer(duration);
    return clearTimer;
    // Re-arms a fresh countdown whenever the toast (re)opens or its
    // `duration` changes — deliberately not depending on `startTimer`/
    // `clearTimer` themselves beyond what's already covered by `open`/`duration`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, duration]);

  return (
    <Presence present={forceMount || open}>
      <ToastProvider
        scope={__scopeToast}
        open={open}
        onOpenChange={setOpen}
        titleId={titleId}
        descriptionId={descriptionId}
        pauseTimer={pauseTimer}
        resumeTimer={resumeTimer}
      >
        <Primitive
          as="div"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-state={open ? 'open' : 'closed'}
          {...toastProps}
          ref={forwardedRef}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            pauseTimer();
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            resumeTimer();
          }}
        />
      </ToastProvider>
    </Presence>
  );
});

Toast.displayName = 'Toast';

export { Toast };
export type { ToastProps };
