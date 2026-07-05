import * as React from 'react';
import type { Orientation, ScopedProps } from './roving-focus-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';
interface RovingFocusGroupProps extends PrimitivePropsWithRef<'div'> {
    /** @default 'horizontal' */
    orientation?: Orientation;
    /** Arrow key navigation wraps from the last item back to the first (and vice versa). @default false */
    loop?: boolean;
    /** Which item is the initial tab stop; defaults to whichever item registers first. */
    defaultCurrentTabStopId?: string;
}
/**
 * Implements the "roving tabindex" keyboard pattern shared by `Tabs`,
 * `RadioGroup`, `Menu`, and toolbars: only one item in the group is ever a
 * Tab stop (`tabIndex={0}`) at a time — everyone else is `tabIndex={-1}` —
 * and arrow keys move which item that is. Wrap a group of `FocusItem`s in
 * this to get that behavior generically instead of re-implementing it per
 * component (see `@nebula/headless`'s `Tabs`, which currently hand-rolls an
 * equivalent of this and is a candidate to migrate onto it).
 *
 * @example
 * ```tsx
 * <RovingFocusGroup orientation="horizontal" loop>
 *   <FocusItem asChild><button>One</button></FocusItem>
 *   <FocusItem asChild><button>Two</button></FocusItem>
 *   <FocusItem asChild><button>Three</button></FocusItem>
 * </RovingFocusGroup>
 * ```
 */
declare const RovingFocusGroup: React.ForwardRefExoticComponent<Omit<ScopedProps<RovingFocusGroupProps>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { RovingFocusGroup };
export type { RovingFocusGroupProps };
//# sourceMappingURL=roving-focus-group.d.ts.map