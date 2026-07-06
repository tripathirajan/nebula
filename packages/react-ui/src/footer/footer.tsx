import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type FooterProps = PrimitivePropsWithRef<'footer'>;

/** A page/app-level `<footer>` — same purely-presentational treatment as `Header`, just `border-t` instead of `border-b`. */
const Footer = React.forwardRef<HTMLElement, FooterProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="footer"
      className={cn(
        'flex items-center justify-between gap-4 border-t border-[var(--footer-border)] bg-[var(--footer-bg)] px-4 py-3 text-[var(--footer-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Footer.displayName = 'Footer';

export { Footer };
export type { FooterProps };
