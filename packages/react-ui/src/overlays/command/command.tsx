import { Command as HeadlessCommand } from '@nebula-lab/headless/command';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CommandProps as HeadlessCommandProps } from '@nebula-lab/headless/command';

type CommandProps = HeadlessCommandProps;

/** The palette's outer card — same `base-100`/`base-300`/`base-content` surface treatment as `DialogContent`/`PopoverContent`, since a command palette is usually rendered inside a consumer-supplied `Dialog`. */
const Command = React.forwardRef<HTMLDivElement, CommandProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessCommand
      className={cn(
        'flex flex-col overflow-hidden rounded-[var(--radius-box)] border border-[var(--command-border)] bg-[var(--command-bg)] text-[var(--command-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Command.displayName = 'Command';

export { Command };
export type { CommandProps };
