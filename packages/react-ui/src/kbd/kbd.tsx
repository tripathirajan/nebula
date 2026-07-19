import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type KbdProps = PrimitivePropsWithRef<'kbd'>;

/**
 * A keyboard-shortcut label (e.g. "⌘" + "K") — same "no lower-layer
 * counterpart" treatment `Blockquote` documents. Renders the native `<kbd>`
 * element, which already carries the correct semantic meaning on its own;
 * this only adds the small monospace pill look.
 *
 * @example
 * ```tsx
 * <Text>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.</Text>
 * ```
 */
const Kbd = React.forwardRef<HTMLElement, KbdProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-[var(--kbd-border)] bg-[var(--kbd-bg)] px-1 font-mono text-xs font-medium text-[var(--kbd-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Kbd.displayName = 'Kbd';

export { Kbd };
export type { KbdProps };
