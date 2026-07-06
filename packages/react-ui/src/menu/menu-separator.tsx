import { cn } from '@nebula/primitives/cn';
import { MenuSeparator as StylelessMenuSeparator } from '@nebula/styleless/menu';
import * as React from 'react';

import type { MenuSeparatorProps as StylelessMenuSeparatorProps } from '@nebula/styleless/menu';

type MenuSeparatorProps = StylelessMenuSeparatorProps;

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessMenuSeparator
        className={cn('my-1 h-px bg-[var(--menu-separator)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

MenuSeparator.displayName = 'MenuSeparator';

export { MenuSeparator };
export type { MenuSeparatorProps };
