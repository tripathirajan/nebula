import * as React from 'react';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';
/** Props accepted by {@link VisuallyHidden}. */
type VisuallyHiddenProps<E extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<E>;
/**
 * Hides content visually while keeping it in the accessibility tree — for
 * text that a sighted user doesn't need (a redundant label, an icon
 * button's accessible name) but a screen reader user does.
 *
 * @example
 * ```tsx
 * <button>
 *   <TrashIcon aria-hidden />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 * ```
 */
declare const VisuallyHidden: PolymorphicComponent<"span">;
export { VisuallyHidden };
export type { VisuallyHiddenProps };
//# sourceMappingURL=visually-hidden.d.ts.map