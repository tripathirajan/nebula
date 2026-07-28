import { CommandEmpty as HeadlessCommandEmpty } from '@nebula-lab/headless/command';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CommandEmptyProps as HeadlessCommandEmptyProps } from '@nebula-lab/headless/command';

type CommandEmptyProps = HeadlessCommandEmptyProps;

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessCommandEmpty
      className={cn('py-6 text-center text-sm text-[var(--command-text)]/60', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandEmpty.displayName = 'CommandEmpty';

export { CommandEmpty };
export type { CommandEmptyProps };
