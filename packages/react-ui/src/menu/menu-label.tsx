import { cn } from '@nebula/primitives/cn';
import { MenuLabel as StylelessMenuLabel } from '@nebula/styleless/menu';
import * as React from 'react';

import type { MenuLabelProps as StylelessMenuLabelProps } from '@nebula/styleless/menu';

type MenuLabelProps = StylelessMenuLabelProps;

const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessMenuLabel
      className={cn('px-2 py-1.5 text-xs font-medium text-[var(--menu-text)]/60', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

MenuLabel.displayName = 'MenuLabel';

export { MenuLabel };
export type { MenuLabelProps };
