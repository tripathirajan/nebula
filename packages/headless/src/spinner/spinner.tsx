
import { Primitive } from '@nebula/primitives/primitive';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface SpinnerProps extends PrimitivePropsWithRef<'div'> {
  /**
   * Accessible label announced to screen readers while the spinner is
   * visible. Unlike most components, a bare spinner icon has no visible
   * text of its own to derive an accessible name from, so this is required
   * reading (via a sensible default) rather than optional polish.
   * @default 'Loading...'
   */
  label?: string;
}

/**
 * `role="status"` — announces the loading state to assistive tech via a
 * visually-hidden label, without requiring visible text. Renders no visual
 * spinner itself (no spin animation, no SVG) — that's `react-ui`'s job; this
 * component only wires up the accessibility contract every spinner needs
 * regardless of how it looks.
 *
 * @example
 * ```tsx
 * <Spinner label="Loading results" />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>((props, forwardedRef) => {
  const { label = 'Loading...', children, ...spinnerProps } = props;

  return (
    <Primitive as="div" role="status" {...spinnerProps} ref={forwardedRef}>
      {children}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Primitive>
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };
