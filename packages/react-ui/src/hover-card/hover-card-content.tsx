import { HoverCardContent as HeadlessHoverCardContent } from '@nebula/headless/hover-card';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { HoverCardContentProps as HeadlessHoverCardContentProps } from '@nebula/headless/hover-card';

type HoverCardContentProps = HeadlessHoverCardContentProps;

/** Anchor-positioned preview card — same `base-100`/`base-300`/`base-content` surface treatment as `PopoverContent`, since a hover card is "more page surface," not a high-contrast callout like `Tooltip`. */
const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessHoverCardContent
        className={cn(
          'z-50 w-64 rounded-[var(--radius-popover)] border border-[var(--hover-card-content-border)] bg-[var(--hover-card-content-bg)] p-4 text-sm text-[var(--hover-card-text)] shadow-md focus-visible:outline-none',
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
