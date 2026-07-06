import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type NavbarProps = PrimitivePropsWithRef<'nav'>;

/**
 * A horizontal `<nav>` row — distinct from `Header` in tag (`nav` vs.
 * `header`) and intent: `Header` is the page/app-level landmark a `Navbar`
 * often lives inside of, alongside a logo or page title, rather than being
 * the same element under two names.
 *
 * @example
 * ```tsx
 * <Header>
 *   <Logo />
 *   <Navbar>
 *     <a href="/">Home</a>
 *     <a href="/about">About</a>
 *   </Navbar>
 * </Header>
 * ```
 */
const Navbar = React.forwardRef<HTMLElement, NavbarProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="nav"
      className={cn(
        'flex items-center gap-4 bg-[var(--navbar-bg)] px-4 py-2 text-[var(--navbar-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Navbar.displayName = 'Navbar';

export { Navbar };
export type { NavbarProps };
