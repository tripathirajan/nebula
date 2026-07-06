import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type HeaderProps = PrimitivePropsWithRef<'header'>;

/**
 * A page/app-level `<header>` — purely presentational structure, no
 * behavior, so (like `Card`) there's no matching `@nebula/styleless`
 * compound underneath this one; a thin `cn()` wrapper around `Primitive`
 * directly. Sits alongside `Footer`/`Navbar`/`Sidebar`/`Main` as this
 * package's page-shell building blocks — `react-ui-blocks`' `AppLayout`
 * composes some of these one layer up rather than this package hardcoding
 * a specific shell shape.
 *
 * @example
 * ```tsx
 * <Header>
 *   <Logo />
 *   <Nav />
 * </Header>
 * ```
 */
const Header = React.forwardRef<HTMLElement, HeaderProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="header"
      className={cn(
        'flex items-center justify-between gap-4 border-b border-[var(--header-border)] bg-[var(--header-bg)] px-4 py-3 text-[var(--header-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Header.displayName = 'Header';

export { Header };
export type { HeaderProps };
