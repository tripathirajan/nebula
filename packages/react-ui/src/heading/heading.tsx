import { cn } from '@nebula/primitives/cn';
import { Heading as PrimitiveHeading } from '@nebula/primitives/heading';
import * as React from 'react';

import type { HeadingOwnProps, HeadingProps as PrimitiveHeadingProps } from '@nebula/primitives/heading';
import type { PolymorphicComponent } from '@nebula/primitives/types';

/**
 * Styled `Heading` — wraps `@nebula/primitives`' unstyled, polymorphic
 * `Heading` (which already derives size/weight from `level`, independent of
 * the rendered tag) and adds this theme's heading font stack
 * (`--font-heading`, same variable `DialogTitle` already reads) plus the
 * default body text color.
 *
 * @example
 * ```tsx
 * <Heading as="h1" level={1}>Page title</Heading>
 * <Heading as="h2" level={4}>Visually smaller section heading</Heading>
 * ```
 */
const Heading = React.forwardRef(
  <E extends React.ElementType = 'h2'>(
    props: PrimitiveHeadingProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveHeading
        className={cn('font-[var(--font-heading)] text-[var(--text-color)]', className)}
        {...(rest as PrimitiveHeadingProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as PolymorphicComponent<'h2', HeadingOwnProps>;

Heading.displayName = 'Heading';

export { Heading };
export type { PrimitiveHeadingProps as HeadingProps };
export type { HeadingLevel } from '@nebula/primitives/heading';
