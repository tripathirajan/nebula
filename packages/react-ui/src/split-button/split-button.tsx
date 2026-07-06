import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type SplitButtonProps = PrimitivePropsWithRef<'div'>;

/**
 * A primary action button attached to a second, smaller trigger button
 * (typically an `IconButton` chevron opening a `DropdownMenu` of related
 * actions) — the same visual-merge CSS trick `ButtonGroup` uses, just
 * without an `orientation` option (a split button is always a horizontal
 * pair). Composition, not a new state machine: wrap a `DropdownMenu`'s
 * `MenuTrigger asChild` around the second button yourself.
 *
 * @example
 * ```tsx
 * <SplitButton>
 *   <Button onClick={save}>Save</Button>
 *   <DropdownMenu>
 *     <MenuTrigger asChild>
 *       <IconButton aria-label="More save options">
 *         <ChevronDownIcon />
 *       </IconButton>
 *     </MenuTrigger>
 *     <MenuPortal>
 *       <MenuContent>
 *         <MenuItem onSelect={saveAs}>Save as…</MenuItem>
 *       </MenuContent>
 *     </MenuPortal>
 *   </DropdownMenu>
 * </SplitButton>
 * ```
 */
const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>((props, forwardedRef) => {
  const { className, role = 'group', ...rest } = props;
  return (
    <Primitive
      as="div"
      role={role}
      className={cn(
        'inline-flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*]:relative [&>*:focus-visible]:z-10',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

SplitButton.displayName = 'SplitButton';

export { SplitButton };
export type { SplitButtonProps };
