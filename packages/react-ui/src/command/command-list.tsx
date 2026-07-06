import { cn } from '@nebula/primitives/cn';
import { CommandList as StylelessCommandList } from '@nebula/styleless/command';
import * as React from 'react';

import type { CommandListProps as StylelessCommandListProps } from '@nebula/styleless/command';

type CommandListProps = StylelessCommandListProps;

/** Scrollable results area — capped height so a long result set scrolls instead of growing the palette off-screen. */
const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessCommandList
      className={cn('max-h-80 overflow-y-auto p-2', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandList.displayName = 'CommandList';

export { CommandList };
export type { CommandListProps };
