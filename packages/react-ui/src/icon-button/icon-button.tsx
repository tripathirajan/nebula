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
 * Defaults to `variant="text"`/`color="neutral"` — unlike `Button`, whose
 * `default`/`primary` defaults suit a standalone CTA, an icon-only button is
 * almost always one of several sitting in a toolbar/header (a settings gear,
 * a close `X`, a bell) where a filled, bordered, brand-colored square per
 * icon reads as visual noise. `text`/`neutral` renders as a plain glyph in
 * the theme's body-text color until hovered, matching the "toolbar icon"
 * convention this design system's Minimals-inspired reference charter calls
 * for; pass an explicit `variant`/`color` (as `ThemeSwitcher`'s icon variant
 * and `SaasAppHeader`'s notification bell already do) for an icon button
 * that should stand out on its own.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Settings"><SettingsIcon /></IconButton>
 * <IconButton aria-label="Delete" variant="default" color="danger">
 *   <TrashIcon />
 * </IconButton>
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef) => {
  const { className, variant = 'text', color = 'neutral', size, ...buttonProps } = props;

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
