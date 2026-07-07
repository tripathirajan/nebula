import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type BlockquoteProps = PrimitivePropsWithRef<'blockquote'>;

/**
 * A quoted passage — purely presentational, no `@nebula/primitives`/
 * `@nebula/headless` counterpart underneath (unlike `Text`/`Heading`/
 * `Code`, which wrap an existing unstyled primitive), same "thin `cn()`
 * wrapper directly around `Primitive`" treatment this session's `Header`/
 * `Footer`/etc. use — there was nowhere else in the layer stack this
 * belonged, and it has no state/behavior to decouple from styling anyway.
 *
 * @example
 * ```tsx
 * <Blockquote>Design is not just what it looks like. Design is how it works.</Blockquote>
 * ```
 */
const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="blockquote"
      className={cn(
        'border-l-4 border-[var(--blockquote-border)] pl-4 italic text-[var(--blockquote-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Blockquote.displayName = 'Blockquote';

export { Blockquote };
export type { BlockquoteProps };
