import { TooltipContent as HeadlessTooltipContent } from '@nebula/headless/tooltip';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { TooltipContentProps as HeadlessTooltipContentProps } from '@nebula/headless/tooltip';

type TooltipContentProps = HeadlessTooltipContentProps;

/**
 * Small, high-contrast label anchored to `TooltipTrigger` — styled off
 * `--tooltip-content-bg`/`-text` (see `../tokens/component.ts`), which
 * deliberately reads the `neutral` semantic role rather than the
 * `base-100`/`base-content` surface pair `Popover`/`Dialog` use, so a
 * tooltip visually pops off the page instead of blending in as "more page
 * surface." Radius from `--radius-tooltip`. All positioning (`side`/
 * `align`/`sideOffset`/collision handling) and the hover/focus open-delay
 * behavior are inherited unchanged from `@nebula/headless`.
 *
 * @example
 * ```tsx
 * <TooltipContent side="top" sideOffset={4}>
 *   Save your changes
 * </TooltipContent>
 * ```
 */
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessTooltipContent
        className={cn(
          'z-[var(--z-overlay)] rounded-[var(--radius-tooltip)] bg-[var(--tooltip-content-bg)] px-2.5 py-1.5 text-xs text-[var(--tooltip-content-text)] shadow-[var(--elevation-anchored)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

TooltipContent.displayName = 'TooltipContent';

export { TooltipContent };
export type { TooltipContentProps };
