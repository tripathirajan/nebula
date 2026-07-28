import { cn } from '@nebula-lab/primitives/cn';
import { Link as PrimitiveLink } from '@nebula-lab/primitives/link';
import * as React from 'react';

import type { LinkProps as PrimitiveLinkProps } from '@nebula-lab/primitives/link';

/**
 * Styled `Link` — wraps `@nebula-lab/primitives`' unstyled `Link` (which
 * already gives underline-on-hover, a focus-visible ring, and the
 * `external` convenience prop) and adds this theme's primary color.
 *
 * @example
 * ```tsx
 * <Link href="/pricing">See pricing</Link>
 * <Link href="https://example.com" external>External docs</Link>
 * ```
 */
const Link = React.forwardRef(
  <E extends React.ElementType = 'a'>(
    props: PrimitiveLinkProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { className, ...rest } = props;
    return (
      <PrimitiveLink
        className={cn('text-[var(--color-primary)] focus-visible:ring-[var(--color-primary)]', className)}
        {...(rest as PrimitiveLinkProps<E>)}
        ref={forwardedRef}
      />
    );
  },
) as typeof PrimitiveLink;

Link.displayName = 'Link';

export { Link };
export type { PrimitiveLinkProps as LinkProps };
