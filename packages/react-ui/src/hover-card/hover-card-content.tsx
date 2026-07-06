import { cn } from '@nebula/primitives/cn';
import { HoverCardContent as StylelessHoverCardContent } from '@nebula/styleless/hover-card';
import * as React from 'react';

import type { HoverCardContentProps as StylelessHoverCardContentProps } from '@nebula/styleless/hover-card';

type HoverCardContentProps = StylelessHoverCardContentProps;

/** Anchor-positioned preview card — same `base-100`/`base-300`/`base-content` surface treatment as `PopoverContent`, since a hover card is "more page surface," not a high-contrast callout like `Tooltip`. */
const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessHoverCardContent
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
