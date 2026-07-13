import { cn } from '@nebula/primitives/cn';
import {
  getPasswordStrength,
  PasswordStrengthIndicator as StylelessPasswordStrengthIndicator,
} from '@nebula/styleless/password-strength-indicator';
import * as React from 'react';

import type { PasswordStrengthIndicatorProps as StylelessPasswordStrengthIndicatorProps } from '@nebula/styleless/password-strength-indicator';

type PasswordStrengthIndicatorProps = Omit<StylelessPasswordStrengthIndicatorProps, 'classNames'> & {
  className?: string;
};

/**
 * Wraps `@nebula/styleless`'s `PasswordStrengthIndicator` (which owns the
 * real behavior: the length/character-class scoring heuristic and the
 * `role="meter"` semantics) and supplies every part's Tailwind classes via
 * its `classNames` prop — this file's whole job is visual, matching every
 * other `react-ui` wrapper's division of labor with its `styleless`
 * counterpart.
 *
 * Each segment reads the track's own `data-score` via `group`/`group-data-*`
 * (the same technique `DataTableHead`'s sort chevron uses) to color itself
 * red/yellow/green by score tier — no per-render color computation needed
 * here, it's expressed entirely in static Tailwind classes.
 *
 * @example
 * ```tsx
 * <PasswordStrengthIndicator password={password} />
 * ```
 */
const PasswordStrengthIndicator = React.forwardRef<HTMLDivElement, PasswordStrengthIndicatorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;

    return (
      <StylelessPasswordStrengthIndicator
        {...rest}
        ref={forwardedRef}
        classNames={{
          root: cn('flex w-full items-center gap-2', className),
          track: 'group flex flex-1 gap-1',
          segment: cn(
            // `min-w-6` is a floor, not a fixed size — `flex-1` still grows
            // each segment to fill real available width (e.g. matching a
            // password `<input>` above it), but without it, an unconstrained
            // ancestor (no explicit width anywhere up the tree, e.g.
            // Storybook's `layout: 'centered'` decorator) collapses every
            // `flex-basis: 0%` segment to ~0px, since the flex container's
            // own shrink-to-fit width excludes flex-basis-0 items from its
            // intrinsic size calculation.
            'h-1.5 min-w-6 flex-1 rounded-full bg-[var(--password-strength-track)] transition-colors',
            'group-data-[score="0"]:data-[filled]:bg-[var(--color-error)]',
            'group-data-[score="1"]:data-[filled]:bg-[var(--color-error)]',
            'group-data-[score="2"]:data-[filled]:bg-[var(--color-warning)]',
            'group-data-[score="3"]:data-[filled]:bg-[var(--color-success)]',
            'group-data-[score="4"]:data-[filled]:bg-[var(--color-success)]',
          ),
          label: 'w-24 shrink-0 text-xs text-[var(--password-strength-label-text)]',
        }}
      />
    );
  },
);

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export { PasswordStrengthIndicator, getPasswordStrength };
export type { PasswordStrengthIndicatorProps };
