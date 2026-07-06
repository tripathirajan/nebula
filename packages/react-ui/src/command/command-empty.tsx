import { cn } from '@nebula/primitives/cn';
import { CommandEmpty as StylelessCommandEmpty } from '@nebula/styleless/command';
import * as React from 'react';

import type { CommandEmptyProps as StylelessCommandEmptyProps } from '@nebula/styleless/command';

type CommandEmptyProps = StylelessCommandEmptyProps;

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessCommandEmpty
      className={cn('py-6 text-center text-sm text-[var(--command-text)]/60', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

CommandEmpty.displayName = 'CommandEmpty';

export { CommandEmpty };
export type { CommandEmptyProps };
