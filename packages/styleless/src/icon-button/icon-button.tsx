import * as React from 'react';

import { Button } from '../button/button';

import type { ButtonProps } from '../button/button';

/** Props accepted by {@link IconButton}. */
type IconButtonProps = Omit<ButtonProps, 'children'> & {
  /** A single icon — no visible text, so `aria-label` is required to name the button for assistive tech. */
  children: React.ReactNode;
  'aria-label': string;
};

/**
 * `styleless`-tier `IconButton` — wraps this package's own `Button` (so
 * `loading`/`aria-busy`/`data-loading` behavior comes along for free) and
 * adds exactly one structural rule on top: `children` and `aria-label` are
 * both required, since an icon-only button has no accessible name unless
 * one is supplied explicitly. No sizing/shape classes here — `IconButton`'s
 * square shape is a visual decision `@nebula/react-ui`'s version makes.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Settings"><SettingsIcon /></IconButton>
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef) => {
  return <Button {...props} ref={forwardedRef} />;
});

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
