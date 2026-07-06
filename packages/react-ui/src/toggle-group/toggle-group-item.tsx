import { cn } from '@nebula/primitives/cn';
import { ToggleGroupItem as StylelessToggleGroupItem } from '@nebula/styleless/toggle-group';
import * as React from 'react';

import type { ToggleGroupItemProps as StylelessToggleGroupItemProps } from '@nebula/styleless/toggle-group';

type ToggleGroupItemProps = StylelessToggleGroupItemProps;

/** Same `data-state="on"|"off"` fill treatment as this package's own `Toggle` — a `ToggleGroupItem` is a `Toggle` underneath (see the styleless source), just with its pressed state driven by the group instead of local state. */
const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessToggleGroupItem
        className={cn(
          'inline-flex h-8 items-center justify-center gap-2 rounded-[var(--radius-selector)] px-3 text-sm font-medium text-[var(--toggle-text)] outline-none transition-colors hover:bg-[var(--toggle-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--toggle-text)] data-[state=on]:bg-[var(--toggle-on-bg)] data-[state=on]:text-[var(--toggle-on-text)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroupItem };
export type { ToggleGroupItemProps };
