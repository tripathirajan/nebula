import { CommandItem as HeadlessCommandItem } from '@nebula/headless/command';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CommandItemProps as HeadlessCommandItemProps } from '@nebula/headless/command';

type CommandItemProps = HeadlessCommandItemProps;

/** `data-highlighted` (not real focus — see the headless source) drives the fill via `--command-item-highlighted-bg`, same "state attribute, not local state" pattern every other data-driven row in this package uses. */
const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessCommandItem
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-[var(--radius-selector)] px-3 py-2 text-sm data-[highlighted]:bg-[var(--command-item-highlighted-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandItem.displayName = 'CommandItem';

export { CommandItem };
export type { CommandItemProps };
