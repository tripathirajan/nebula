import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface SeparatorOwnProps {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Purely visual (`role="none"`, no `aria-orientation`) vs. a semantic
   * boundary announced to assistive tech (`role="separator"`). Most dividers
   * between unrelated content are decorative — set `decorative={false}` only
   * when the separator itself carries meaning (e.g. between distinct
   * sections of a single composite widget).
   * @default true
   */
  decorative?: boolean;
}

/** Props accepted by {@link Separator}. */
type SeparatorProps = PrimitivePropsWithRef<'div'> & SeparatorOwnProps;

/**
 * A thin rule, horizontal or vertical, styled off `--separator-bg` (see
 * `../tokens/component.ts`), which currently points at `--color-base-300` —
 * the same token flagged as a known WCAG 1.4.11 failure in
 * `CONTRAST_AUDIT.md`. This is exactly the "purely decorative divider" case
 * that finding exempts, per WCAG 1.4.11 only applying to *required* UI
 * boundaries.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" className="h-6" />
 * ```
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>((props, forwardedRef) => {
  const { orientation = 'horizontal', decorative = true, className, ...rest } = props;
  const isHorizontal = orientation === 'horizontal';

  return (
    <Primitive
      as="div"
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--separator-bg)]',
        isHorizontal ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Separator.displayName = 'Separator';

export { Separator };
export type { SeparatorProps };
