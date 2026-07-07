import { CommandSeparator as HeadlessCommandSeparator } from '@nebula/headless/command';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CommandSeparatorProps as HeadlessCommandSeparatorProps } from '@nebula/headless/command';

type CommandSeparatorProps = HeadlessCommandSeparatorProps;

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCommandSeparator
        className={cn('my-1 h-px bg-[var(--command-border)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

CommandSeparator.displayName = 'CommandSeparator';

export { CommandSeparator };
export type { CommandSeparatorProps };
