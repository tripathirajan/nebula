import { MenuSeparator as HeadlessMenuSeparator } from '@nebula/headless/menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { MenuSeparatorProps as HeadlessMenuSeparatorProps } from '@nebula/headless/menu';

type MenuSeparatorProps = HeadlessMenuSeparatorProps;

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessMenuSeparator
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
