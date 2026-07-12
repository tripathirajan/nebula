import { HoverCardContent as HeadlessHoverCardContent } from '@nebula/headless/hover-card';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { HoverCardContentProps as HeadlessHoverCardContentProps } from '@nebula/headless/hover-card';

type HoverCardContentProps = HeadlessHoverCardContentProps;

/**
 * Anchor-positioned preview card — same `base-100`/`base-300`/`base-content`
 * surface treatment as `PopoverContent`, since a hover card is "more page
 * surface," not a high-contrast callout like `Tooltip`. Same
 * `--motion-duration-fast`/`--elevation-anchored` fade/scale treatment as
 * `PopoverContent` too (see its doc comment) — this had none before.
 */
const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessHoverCardContent
        className={cn(
          'z-[var(--z-overlay)] w-64 rounded-[var(--radius-popover)] border border-[var(--hover-card-content-border)] bg-[var(--hover-card-content-bg)] p-4 text-sm text-[var(--hover-card-text)] shadow-[var(--elevation-anchored)] transition-[opacity,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

HoverCardContent.displayName = 'HoverCardContent';

export { HoverCardContent };
export type { HoverCardContentProps };
