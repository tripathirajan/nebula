import { cn } from '@nebula/primitives/cn';
import { Toggle as StylelessToggle } from '@nebula/styleless/toggle';
import * as React from 'react';

import type { ToggleProps as StylelessToggleProps } from '@nebula/styleless/toggle';

type ToggleProps = StylelessToggleProps;

/** `data-state="on"|"off"` (set by the styleless source) fills the button when pressed — same `base-200`/`primary`-adjacent treatment other selectable-row components in this package use. */
const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessToggle
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-[var(--radius-selector)] px-3 text-sm font-medium text-[var(--toggle-text)] outline-none transition-colors hover:bg-[var(--toggle-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--toggle-text)] data-[state=on]:bg-[var(--toggle-on-bg)] data-[state=on]:text-[var(--toggle-on-text)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Toggle.displayName = 'Toggle';

export { Toggle };
export type { ToggleProps };
