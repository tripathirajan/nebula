import { cn } from '@nebula/primitives/cn';
import { Text as PrimitiveText } from '@nebula/primitives/text';
import * as React from 'react';

import type { TextOwnProps, TextProps as PrimitiveTextProps } from '@nebula/primitives/text';
import type { PolymorphicComponent } from '@nebula/primitives/types';

/**
 * Styled `Text` — wraps `@nebula/primitives`' unstyled, polymorphic `Text`
 * (which already gives `as`/`truncate`) and only adds this theme's default
 * body color (`--text-color`, see `../tokens/component.ts`) — no font-size
 * or weight opinion here either, same as the primitive it wraps; reach for
 * `Heading` for headings.
 *
 * @example
 * ```tsx
 * <Text>Plain themed text.</Text>
 * <Text as="p" className="text-sm opacity-70">A muted note.</Text>
 * ```
 */
const Text = React.forwardRef(
  <E extends React.ElementType = 'span'>(
    props: PrimitiveTextProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveText
        className={cn('text-[var(--text-color)]', className)}
        {...(rest as PrimitiveTextProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'span', TextOwnProps>;

Text.displayName = 'Text';

export { Text };
export type { PrimitiveTextProps as TextProps };
