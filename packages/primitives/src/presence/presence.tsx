import * as React from 'react';

import { composeRefs } from '../compose-refs/compose-refs';
import { getElementRef } from '../slot/slot';

type PresenceChildProps = { ref: React.Ref<HTMLElement> };

interface PresenceProps {
  /** Whether the content should be present. Going from `true` to `false` doesn't unmount immediately if a CSS animation/transition is running — see the component doc. */
  present: boolean;
  /**
   * A single element (needs to accept a `ref`), or a render function
   * receiving `{ isPresent }` for cases where the exit-animation class
   * itself depends on presence (e.g. toggling `data-state="open"|"closed"`
   * yourself instead of relying on this component cloning it in).
   */
  children: React.ReactElement<PresenceChildProps> | ((props: { isPresent: boolean }) => React.ReactElement);
}

/**
 * Keeps `children` mounted through an exit animation instead of unmounting
 * the instant `present` becomes `false` — the difference between a
 * `Dialog`'s content snapping out of existence vs. actually playing its
 * closing transition. Detects whether the underlying DOM node has a CSS
 * animation/transition defined (via computed style) and, if so, waits for
 * `animationend`/`transitionend` before actually unmounting; if not, it
 * unmounts synchronously on the next frame (equivalent to no animation at
 * all — no perceptible delay).
 *
 * Honors `prefers-reduced-motion: reduce` (WCAG 2.3.3): when the user has
 * that OS/browser setting on, this skips waiting for the exit
 * animation/transition entirely and unmounts immediately, regardless of
 * what CSS the consumer defined — the same way `hasAnimation`/`hasTransition`
 * both being false is handled. Consumers should still gate the animation
 * itself behind `@media (prefers-reduced-motion: reduce)` in their CSS (this
 * is a safety net, not a substitute for that).
 *
 * @example
 * ```tsx
 * <Presence present={open}>
 *   <div className="data-[state=open]:animate-in data-[state=closed]:animate-out" data-state={open ? 'open' : 'closed'}>
 *     {content}
 *   </div>
 * </Presence>
 * ```
 */
function Presence({ present, children }: PresenceProps) {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const [isPresent, setIsPresent] = React.useState(present);

  React.useEffect(() => {
    if (present) {
      setIsPresent(true);
      return;
    }

    const node = nodeRef.current;
    if (!node) {
      setIsPresent(false);
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsPresent(false);
      return;
    }

    // `''` is treated the same as "unset" (`'none'`/`'0s'`) below: real
    // browsers report the CSS spec's initial values (`animation-name: none`,
    // `*-duration: 0s`) for an element with no animation/transition
    // declared, but jsdom's computed style implementation reports an empty
    // string instead for properties nothing ever set — without excluding
    // it, `'' !== '0s'` and `'' !== 'none'` both evaluate `true`, making
    // every element look like it has a running transition under jsdom.
    const styles = getComputedStyle(node);
    const hasAnimation =
      styles.animationName !== 'none' &&
      styles.animationName !== '' &&
      styles.animationDuration !== '0s' &&
      styles.animationDuration !== '';
    const hasTransition =
      styles.transitionDuration !== '0s' &&
      styles.transitionDuration !== '' &&
      styles.transitionProperty !== 'none';

    if (!hasAnimation && !hasTransition) {
      setIsPresent(false);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setIsPresent(false);
    };

    node.addEventListener('animationend', finish);
    node.addEventListener('transitionend', finish);
    // Safety net in case the animation/transition never fires an end event
    // (e.g. `animation-iteration-count: infinite` left running by mistake).
    const fallback = window.setTimeout(finish, 1000);

    return () => {
      node.removeEventListener('animationend', finish);
      node.removeEventListener('transitionend', finish);
      window.clearTimeout(fallback);
    };
  }, [present]);

  if (!isPresent) return null;

  if (typeof children === 'function') {
    return children({ isPresent });
  }

  const setNodeRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };
  const composedRef = composeRefs(getElementRef(children) as React.Ref<HTMLElement>, setNodeRef);

  return React.cloneElement(children, {
    ref: composedRef,
  } as Partial<PresenceChildProps>);
}

Presence.displayName = 'Presence';

export { Presence };
export type { PresenceProps };
