import { CommandInput as HeadlessCommandInput } from '@nebula/headless/command';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CommandInputProps as HeadlessCommandInputProps } from '@nebula/headless/command';

type CommandInputProps = HeadlessCommandInputProps;

/** Sits flush across the top of the palette with a bottom rule instead of `Input`'s all-around border — visually reads as "one search field," not a boxed form control inside a box. */
const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCommandInput
        className={cn(
          'w-full border-0 border-b border-[var(--command-border)] bg-transparent px-4 py-3 text-sm text-[var(--command-text)] outline-none placeholder:text-[var(--command-text)]/50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

CommandInput.displayName = 'CommandInput';

export { CommandInput };
export type { CommandInputProps };
