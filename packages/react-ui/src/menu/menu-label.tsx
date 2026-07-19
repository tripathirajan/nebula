import { MenuLabel as HeadlessMenuLabel } from '@nebula-lab/headless/menu';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { MenuLabelProps as HeadlessMenuLabelProps } from '@nebula-lab/headless/menu';

type MenuLabelProps = HeadlessMenuLabelProps;

const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessMenuLabel
      className={cn('px-2 py-1.5 text-xs font-medium text-[var(--menu-text)]/60', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

MenuLabel.displayName = 'MenuLabel';

export { MenuLabel };
export type { MenuLabelProps };
