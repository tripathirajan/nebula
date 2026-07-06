import { cn } from '@nebula/primitives/cn';
import { CommandGroup as StylelessCommandGroup } from '@nebula/styleless/command';
import * as React from 'react';

import type { CommandGroupProps as StylelessCommandGroupProps } from '@nebula/styleless/command';

type CommandGroupProps = StylelessCommandGroupProps;

/** `heading` renders as small muted caps text above the group's items — the group `<div>` itself has no visible chrome beyond spacing. */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>((props, forwardedRef) => {
  const { className, heading, ...rest } = props;
  return (
    <StylelessCommandGroup
      heading={
        heading !== undefined ? (
          <span className="px-3 py-1.5 text-xs font-medium text-[var(--command-text)]/60">
            {heading}
          </span>
        ) : undefined
      }
      className={cn('flex flex-col gap-0.5', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandGroup.displayName = 'CommandGroup';

export { CommandGroup };
export type { CommandGroupProps };
