import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface TextOwnProps {
  /** Single-line ellipsis truncation (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`). */
  truncate?: boolean;
}

/** Props accepted by {@link Text}. */
type TextProps<E extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<
  E,
  TextOwnProps
>;

/**
 * Generic inline/block text — no font-size or weight opinion by default
 * (that's for `className`, or reach for `Heading` for headings). Renders a
 * `span` unless `as` says otherwise.
 *
 * @example
 * ```tsx
 * <Text>Plain text, inherits surrounding styles.</Text>
 * <Text as="p" className="text-sm text-gray-500">A muted paragraph-level note.</Text>
 * <Text truncate className="max-w-xs">A long string that will end in an ellipsis…</Text>
 * ```
 */
const Text = React.forwardRef(
  <E extends React.ElementType = 'span'>(
    props: TextProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { as, truncate, className, ...rest } = props;
    return (
      <Primitive
        as={as ?? ('span' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn(truncate && 'overflow-hidden text-ellipsis whitespace-nowrap', className)}
      />
    );
  },
) as PolymorphicComponent<'span', TextOwnProps>;

Text.displayName = 'Text';

export { Text };
export type { TextProps };
