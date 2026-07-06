import { Button as PrimitiveButton } from '@nebula/primitives/button';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { buttonVariants } from '../button/button';

import type { ButtonProps as PrimitiveButtonProps } from '@nebula/primitives/button';
import type { VariantProps } from 'class-variance-authority';

const iconButtonSizeVariants = cva('', {
  variants: {
    size: {
      sm: 'h-8 w-8 p-0',
      md: 'h-10 w-10 p-0',
      lg: 'h-12 w-12 p-0',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface IconButtonOwnProps {
  loading?: boolean;
}

type IconButtonProps = Omit<PrimitiveButtonProps, 'children'> &
  VariantProps<typeof buttonVariants> &
  IconButtonOwnProps & {
    /** A single icon — no visible text, so `aria-label` is required to name the button for assistive tech. */
    children: React.ReactNode;
    'aria-label': string;
  };

/**
 * A square, icon-only `Button` — reuses this package's own `buttonVariants`
 * recipe for color/border/focus-ring so it always matches `Button`'s
 * theming exactly, then overrides just the size classes to be square
 * (`h-*` == `w-*`, `p-0`) instead of `Button`'s padded-with-text shape.
 * `aria-label` is a required prop (not just documented convention) since a
 * bare icon has no accessible name of its own.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Settings" variant="secondary">
 *   <SettingsIcon />
 * </IconButton>
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef) => {
  const { className, variant, size, loading = false, disabled, ...buttonProps } = props;

  return (
    <PrimitiveButton
      className={cn(buttonVariants({ variant, size }), iconButtonSizeVariants({ size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
