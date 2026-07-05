import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

interface LinkOwnProps {
  /**
   * Marks this as an external link: adds `target="_blank"` and
   * `rel="noopener noreferrer"` (prevents the new page from accessing
   * `window.opener` and from inferring your referrer) unless you've set
   * `target`/`rel` yourself.
   */
  external?: boolean;
}

/** Props accepted by {@link Link}. */
type LinkProps<E extends React.ElementType = 'a'> = PolymorphicComponentPropsWithRef<
  E,
  LinkOwnProps
>;

/**
 * An `a` with underline-on-hover + focus-visible ring by default, and an
 * `external` convenience prop. Swap `as` for your framework's router link
 * (e.g. `as={NextLink}`) — Nebula doesn't hard-depend on any router.
 *
 * @example
 * ```tsx
 * <Link href="/pricing">See pricing</Link>
 * <Link href="https://example.com" external>External docs</Link>
 *
 * // Framework router integration:
 * <Link as={NextLink} href="/dashboard">Dashboard</Link>
 * ```
 */
const Link = React.forwardRef(
  <E extends React.ElementType = 'a'>(props: LinkProps<E>, forwardedRef: React.Ref<unknown>) => {
    const { as, external, target, rel, className, ...rest } = props;

    return (
      <Primitive
        as={as ?? ('a' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        className={cn(
          'underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2',
          className,
        )}
      />
    );
  },
) as PolymorphicComponent<'a', LinkOwnProps>;

Link.displayName = 'Link';

export { Link };
export type { LinkProps };
