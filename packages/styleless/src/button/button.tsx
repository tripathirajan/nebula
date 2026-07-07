import { Button as PrimitiveButton } from '@nebula/primitives/button';
import * as React from 'react';

import type { ButtonProps as PrimitiveButtonProps } from '@nebula/primitives/button';

/** Props accepted by {@link Button}. */
interface ButtonProps extends PrimitiveButtonProps {
  /**
   * Marks the button as busy: sets `aria-busy`, adds `data-loading` (for a
   * consumer's own spinner/opacity styling), and forces `disabled` so a
   * second activation can't fire mid-request. Deliberately renders no
   * spinner icon itself — that's a visual choice for `@nebula/react-ui`'s
   * `Button` (or any other consumer) to make, not something this
   * zero-visual-opinion layer should decide.
   */
  loading?: boolean;
}

/**
 * `styleless`-tier `Button` — the reusable, complete API a moment before any
 * visual design gets applied: real `loading` semantics (`aria-busy`,
 * `data-loading`, forced `disabled`) on top of `@nebula/primitives`' bare
 * `Button`, but no Tailwind classes/variants of any kind. `@nebula/react-ui`'s
 * `Button` wraps this one and adds only `cva`-driven styling — see that
 * package's `button.tsx` for the themed version.
 *
 * @example
 * ```tsx
 * <Button onClick={() => {}}>Click me</Button>
 * <Button loading>Saving…</Button>
 * <Button asChild><a href="/pricing">See pricing</a></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { loading = false, disabled, ...rest } = props;

  return (
    <PrimitiveButton
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
