import { PopoverContent as HeadlessPopoverContent } from '@nebula/headless/popover';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PopoverContentProps as HeadlessPopoverContentProps } from '@nebula/headless/popover';

type PopoverContentProps = HeadlessPopoverContentProps;

/**
 * Anchor-positioned card — styled off `--popover-content-bg`/`-border`/
 * `-text` (see `../tokens/component.ts`), radius from `--radius-popover`
 * (smaller than `Dialog`'s `--radius-dialog` by default in this theme's
 * token values, though both currently share the same `2rem` — see
 * `tokens/primitive.ts`). All positioning (`side`/`align`/`sideOffset`/
 * collision handling) is inherited unchanged from `@nebula/headless`.
 *
 * Fades/scales in on open and out on close via `data-[state]`, reading the
 * shared `--motion-duration-fast`/`--motion-ease-out` tokens and the
 * `--elevation-anchored` shadow tier (the lighter of this repo's two overlay
 * elevation tiers, for surfaces that follow a trigger rather than take over
 * the interaction — see `tokens/primitive.ts`'s `elevation` doc comment).
 * `Presence` (the headless `Popover` root already composes it, see that
 * component's own doc comment) keeps this mounted for the transition's
 * duration instead of unmounting immediately on close.
 *
 * @example
 * ```tsx
 * <PopoverContent side="bottom" align="start" sideOffset={4}>
 *   Filter options.
 * </PopoverContent>
 * ```
 */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPopoverContent
        className={cn(
          'z-[var(--z-overlay)] w-64 rounded-[var(--radius-popover)] border border-[var(--popover-content-border)] bg-[var(--popover-content-bg)] p-4 text-sm text-[var(--popover-text)] shadow-[var(--elevation-anchored)] transition-[opacity,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PopoverContent.displayName = 'PopoverContent';

export { PopoverContent };
export type { PopoverContentProps };
