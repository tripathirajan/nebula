import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type MainProps = PrimitivePropsWithRef<'main'>;

/**
 * The page's `<main>` landmark — `flex-1` so it fills remaining space
 * alongside a `Sidebar`/`Header`/`Footer` in a flex/grid page shell.
 * Deliberately carries no background/border of its own (unlike `Header`/
 * `Footer`/`Sidebar`) — it's the neutral content region those frame, not
 * another framed surface itself.
 *
 * @example
 * ```tsx
 * <div className="flex">
 *   <Sidebar>...</Sidebar>
 *   <Main>
 *     <Section>...</Section>
 *   </Main>
 * </div>
 * ```
 */
const Main = React.forwardRef<HTMLElement, MainProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return <Primitive as="main" className={cn('flex-1 p-4', className)} {...rest} ref={forwardedRef} />;
});

Main.displayName = 'Main';

export { Main };
export type { MainProps };
