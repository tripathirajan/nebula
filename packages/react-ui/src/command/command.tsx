import { cn } from '@nebula/primitives/cn';
import { Command as StylelessCommand } from '@nebula/styleless/command';
import * as React from 'react';

import type { CommandProps as StylelessCommandProps } from '@nebula/styleless/command';

type CommandProps = StylelessCommandProps;

/** The palette's outer card — same `base-100`/`base-300`/`base-content` surface treatment as `DialogContent`/`PopoverContent`, since a command palette is usually rendered inside a consumer-supplied `Dialog`. */
const Command = React.forwardRef<HTMLDivElement, CommandProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessCommand
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
