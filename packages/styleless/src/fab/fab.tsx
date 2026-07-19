import * as React from 'react';

import { Button } from '../button/button';

import type { ButtonProps } from '../button/button';

/** Props accepted by {@link FAB}. */
type FABProps = Omit<ButtonProps, 'children'> & {
  /** A single icon — no visible text, so `aria-label` is required. */
  children: React.ReactNode;
  'aria-label': string;
};

/**
 * `styleless`-tier Floating Action Button — structurally identical to
 * `IconButton` (icon-only, requires `aria-label`, inherits `Button`'s
 * `loading` semantics) with its own name because it's a distinct semantic
 * role (a page's single most prominent action) even though the unstyled
 * shape is the same; `@nebula-lab/react-ui`'s `FAB` is what actually makes it
 * *look* circular/elevated. Deliberately applies no positioning of its own
 * — `fixed`/`bottom-*`/`right-*` placement is a page-layout concern the
 * consumer (or the `react-ui` layer) owns.
 *
 * @example
 * ```tsx
 * <FAB aria-label="Compose"><PlusIcon /></FAB>
 * ```
 */
const FAB = React.forwardRef<HTMLButtonElement, FABProps>((props, forwardedRef) => {
  return <Button {...props} ref={forwardedRef} />;
});

FAB.displayName = 'FAB';

export { FAB };
export type { FABProps };
