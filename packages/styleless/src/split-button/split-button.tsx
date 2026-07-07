import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

/** Props accepted by {@link SplitButton}. */
type SplitButtonProps = PrimitivePropsWithRef<'div'>;

/**
 * `styleless`-tier `SplitButton` — the structural contract only: a
 * `role="group"` wrapper around a primary action button and a second,
 * smaller trigger (typically a `DropdownMenu`-opening `IconButton`
 * chevron). No visual merging (border-radius removal, `-ml-px`,
 * focus-visible `z-index`) here — that's `@nebula/react-ui`'s job; this
 * layer's contribution is purely "these buttons are one semantic group,"
 * same test `Card`/`FormControl` groupings use elsewhere in this package.
 * Composition, not a new state machine — wrap a `DropdownMenu` yourself.
 *
 * @example
 * ```tsx
 * <SplitButton>
 *   <Button onClick={save}>Save</Button>
 *   <IconButton aria-label="More save options"><ChevronDownIcon /></IconButton>
 * </SplitButton>
 * ```
 */
const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>((props, forwardedRef) => {
  const { role = 'group', ...rest } = props;
  return <Primitive as="div" role={role} {...rest} ref={forwardedRef} />;
});

SplitButton.displayName = 'SplitButton';

export { SplitButton };
export type { SplitButtonProps };
