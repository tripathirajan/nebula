import * as React from 'react';
import type { ScopedProps } from './roving-focus-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';
interface FocusItemProps extends PrimitivePropsWithRef<'span'> {
    /**
     * Registers this item without making it a valid Tab stop — for a
     * temporarily-disabled item that should stay in the DOM (and still be
     * skippable via arrow keys) without ever receiving focus.
     * @default true
     */
    focusable?: boolean;
}
/**
 * One focusable item inside a `RovingFocusGroup`. Sets its own `tabIndex`
 * (`0` if it's the group's current tab stop, `-1` otherwise) and handles
 * arrow-key navigation to the next/previous item — Home/End jump to the
 * first/last. Almost always used with `asChild` to wrap the actual
 * interactive element (a `button`, a `Tab`, ...) rather than rendering its
 * own tag.
 *
 * @example
 * ```tsx
 * <FocusItem asChild>
 *   <button onClick={() => select('one')}>One</button>
 * </FocusItem>
 * ```
 */
declare const FocusItem: React.ForwardRefExoticComponent<Omit<ScopedProps<FocusItemProps>, "ref"> & React.RefAttributes<HTMLElement>>;
export { FocusItem };
export type { FocusItemProps };
//# sourceMappingURL=focus-item.d.ts.map