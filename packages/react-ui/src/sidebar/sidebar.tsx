import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface SidebarOwnProps {
  /** Which edge the border (and, by convention, this sidebar) sits on. @default 'left' */
  side?: 'left' | 'right';
}

type SidebarProps = PrimitivePropsWithRef<'aside'> & SidebarOwnProps;

/**
 * A fixed-width `<aside>` for app navigation/filters — `side` only flips
 * which edge gets the border (`border-r` for a left sidebar, `border-l` for
 * a right one); actual page placement is the consumer's own layout (flex/
 * grid) concern, same as every other component here not hardcoding position.
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <Sidebar>
 *     <nav>...</nav>
 *   </Sidebar>
 *   <Main>...</Main>
 * </div>
 * ```
 */
const Sidebar = React.forwardRef<HTMLElement, SidebarProps>((props, forwardedRef) => {
  const { className, side = 'left', ...rest } = props;
  return (
    <Primitive
      as="aside"
      className={cn(
        'flex w-64 shrink-0 flex-col gap-1 bg-[var(--sidebar-bg)] p-4 text-[var(--sidebar-text)]',
        side === 'left' ? 'border-r border-[var(--sidebar-border)]' : 'border-l border-[var(--sidebar-border)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Sidebar.displayName = 'Sidebar';

export { Sidebar };
export type { SidebarProps };
