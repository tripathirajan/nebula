import { CommandGroup as HeadlessCommandGroup } from '@nebula-lab/headless/command';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CommandGroupProps as HeadlessCommandGroupProps } from '@nebula-lab/headless/command';

type CommandGroupProps = HeadlessCommandGroupProps;

/** `heading` renders as small muted caps text above the group's items — the group `<div>` itself has no visible chrome beyond spacing. */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>((props, forwardedRef) => {
  const { className, heading, ...rest } = props;
  return (
    <HeadlessCommandGroup
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
