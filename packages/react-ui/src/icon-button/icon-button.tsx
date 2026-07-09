import { cn } from '@nebula/primitives/cn';
import { IconButton as StylelessIconButton } from '@nebula/styleless/icon-button';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { buttonVariants } from '../button/button';

import type { IconButtonProps as StylelessIconButtonProps } from '@nebula/styleless/icon-button';
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

type IconButtonProps = StylelessIconButtonProps & VariantProps<typeof buttonVariants>;

/**
 * A square, icon-only `Button` — wraps `@nebula/styleless`'s `IconButton`
 * (which already enforces the required-`aria-label` contract and carries
 * `Button`'s `loading` semantics), then reuses this package's own
 * `buttonVariants` recipe for color/border/focus-ring so it always matches
 * `Button`'s theming exactly, overriding just the size classes to be square
 * (`h-*` == `w-*`, `p-0`) instead of `Button`'s padded-with-text shape.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Settings" color="secondary">
 *   <SettingsIcon />
 * </IconButton>
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef) => {
  const { className, variant, color, size, ...buttonProps } = props;

  return (
    <StylelessIconButton
      className={cn(
        buttonVariants({ variant, color, size }),
        iconButtonSizeVariants({ size }),
        className,
      )}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
