import { CommandList as HeadlessCommandList } from '@nebula/headless/command';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CommandListProps as HeadlessCommandListProps } from '@nebula/headless/command';

type CommandListProps = HeadlessCommandListProps;

/** Scrollable results area — capped height so a long result set scrolls instead of growing the palette off-screen. */
const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessCommandList
      className={cn('max-h-80 overflow-y-auto p-2', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandList.displayName = 'CommandList';

export { CommandList };
export type { CommandListProps };
