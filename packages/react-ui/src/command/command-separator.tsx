import { cn } from '@nebula/primitives/cn';
import { CommandSeparator as StylelessCommandSeparator } from '@nebula/styleless/command';
import * as React from 'react';

import type { CommandSeparatorProps as StylelessCommandSeparatorProps } from '@nebula/styleless/command';

type CommandSeparatorProps = StylelessCommandSeparatorProps;

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessCommandSeparator
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
