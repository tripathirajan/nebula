import { Dialog } from '../dialog/dialog';

import type { DialogProps } from '../dialog/dialog';

type DrawerProps = DialogProps;

/**
 * Root of the Drawer compound component — a thin re-export of `Dialog`'s
 * root (reusing its context/scope directly, same technique `AlertDialog`
 * uses): a drawer/"sheet" is behaviorally identical to a dialog (modal by
 * default, traps focus, Escape/outside-click dismisses) — the only
 * difference is *where* the panel sits and how it enters, which is exactly
 * what `DrawerContent`'s `side` prop and the consumer's own CSS handle, not
 * a different state machine. `DrawerTrigger`/`DrawerPortal`/`DrawerOverlay`/
 * `DrawerTitle`/`DrawerDescription`/`DrawerClose` are thin renamed re-exports
 * of `Dialog`'s parts for the same reason; only `DrawerContent` is a real
 * second implementation.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open cart</DrawerTrigger>
 *   <DrawerPortal>
 *     <DrawerOverlay />
 *     <DrawerContent side="right">
 *       <DrawerTitle>Your cart</DrawerTitle>
 *       <DrawerClose aria-label="Close">×</DrawerClose>
 *     </DrawerContent>
 *   </DrawerPortal>
 * </Drawer>
 * ```
 */
const Drawer = Dialog;

export { Drawer };
export type { DrawerProps };
