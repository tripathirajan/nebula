import { Spinner as HeadlessSpinner } from '@nebula/headless/spinner';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { SpinnerProps as HeadlessSpinnerProps } from '@nebula/headless/spinner';

type SpinnerProps = HeadlessSpinnerProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Spinner` — the `role="status"`
 * + visually-hidden label announcement come from there unchanged. This
 * layer adds the actual spinning visual: a ring built from two stacked
 * borders (a dim full circle via `--spinner-track`, a bright quarter-arc via
 * `--spinner-indicator` on just the top edge), rotated with Tailwind's
 * built-in `animate-spin` — no custom `@keyframes` needed.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner className="h-8 w-8 border-4" label="Loading results" />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessSpinner
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--spinner-track)] border-t-[var(--spinner-indicator)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };
