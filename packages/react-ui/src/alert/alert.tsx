import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * Two independent axes, same split `Button`/`Badge` already establish:
 * `variant` is the *shape* (`filled` solid, `soft` light-tinted, `outline`
 * border-only), `color` is the *severity* (`info`/`success`/`warning`/
 * `danger` — narrower than `Badge`'s 8-color palette on purpose, see
 * `alertTokens`' own doc comment in `../tokens/component.ts`). This single
 * component covers what would otherwise be `Banner`/`Callout`/
 * `InlineMessage` as three separate components — they're all the same
 * "static message box" shape at a different weight: `filled` reads as a
 * `Banner` (full-attention), `soft` as a `Callout` (gentle emphasis),
 * `outline` as an `InlineMessage` (minimal, inline). Every shape reads the
 * same `alertTokens.<color>` triple — see that token group's own comment
 * for why `text` is safe to reuse unchanged across all three shapes.
 */
const alertVariants = cva('flex items-start gap-3 rounded-[var(--radius-box)] p-4 text-sm', {
  variants: {
    variant: {
      filled: '',
      soft: '',
      outline: 'border bg-transparent',
    },
    color: {
      info: '',
      success: '',
      warning: '',
      danger: '',
    },
  },
  // Written literally per variant/color pair, not built from a
  // `${color}` template-literal interpolation — Tailwind's JIT scanner
  // can't discover interpolated arbitrary values via static text
  // matching, same reasoning `buttonVariants`/`badgeVariants` document.
  compoundVariants: [
    { variant: 'filled', color: 'info', class: 'bg-[var(--alert-info-bg)] text-[var(--alert-info-text)]' },
    { variant: 'filled', color: 'success', class: 'bg-[var(--alert-success-bg)] text-[var(--alert-success-text)]' },
    { variant: 'filled', color: 'warning', class: 'bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)]' },
    { variant: 'filled', color: 'danger', class: 'bg-[var(--alert-danger-bg)] text-[var(--alert-danger-text)]' },
    {
      variant: 'soft',
      color: 'info',
      class: 'bg-[color-mix(in_oklch,var(--alert-info-bg)_15%,transparent)] text-[var(--alert-info-text)]',
    },
    {
      variant: 'soft',
      color: 'success',
      class: 'bg-[color-mix(in_oklch,var(--alert-success-bg)_15%,transparent)] text-[var(--alert-success-text)]',
    },
    {
      variant: 'soft',
      color: 'warning',
      class: 'bg-[color-mix(in_oklch,var(--alert-warning-bg)_15%,transparent)] text-[var(--alert-warning-text)]',
    },
    {
      variant: 'soft',
      color: 'danger',
      class: 'bg-[color-mix(in_oklch,var(--alert-danger-bg)_15%,transparent)] text-[var(--alert-danger-text)]',
    },
    { variant: 'outline', color: 'info', class: 'border-[var(--alert-info-border)] text-[var(--alert-info-text)]' },
    {
      variant: 'outline',
      color: 'success',
      class: 'border-[var(--alert-success-border)] text-[var(--alert-success-text)]',
    },
    {
      variant: 'outline',
      color: 'warning',
      class: 'border-[var(--alert-warning-border)] text-[var(--alert-warning-text)]',
    },
    {
      variant: 'outline',
      color: 'danger',
      class: 'border-[var(--alert-danger-border)] text-[var(--alert-danger-text)]',
    },
  ],
  defaultVariants: {
    variant: 'filled',
    color: 'info',
  },
});

const DEFAULT_ICONS: Record<'info' | 'success' | 'warning' | 'danger', React.ReactNode> = {
  info: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  success: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  warning: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
};

interface AlertOwnProps extends VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  /** Defaults to a severity-appropriate icon per `color`. Pass `null` to render no icon at all. */
  icon?: React.ReactNode;
  /** Called when the built-in dismiss button is clicked — omit entirely for a non-dismissible alert. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Required whenever `onDismiss` is given. */
  dismissLabel?: string;
}

type AlertProps = Omit<PrimitivePropsWithRef<'div'>, 'color'> & AlertOwnProps;

/**
 * A status message box — `role="alert"` for assertive, auto-announced
 * severities (`warning`/`danger`); `info`/`success` get `role="status"`
 * instead, since a polite, non-interrupting announcement is more
 * appropriate for good-news/neutral messages (mirrors the WAI-ARIA
 * distinction between `alert` and `status` live regions).
 *
 * @example
 * ```tsx
 * <Alert color="danger" title="Something went wrong">
 *   Your changes couldn't be saved. Try again.
 * </Alert>
 * <Alert variant="soft" color="success" onDismiss={() => setShown(false)} dismissLabel="Dismiss">
 *   Your profile has been updated.
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, forwardedRef) => {
  const {
    className,
    variant,
    color: colorProp,
    title,
    icon,
    onDismiss,
    dismissLabel,
    children,
    ...rest
  } = props;
  const color = colorProp ?? 'info';

  const resolvedIcon = icon === undefined ? DEFAULT_ICONS[color] : icon;

  return (
    <Primitive
      as="div"
      role={color === 'warning' || color === 'danger' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant, color }), className)}
      {...rest}
      ref={forwardedRef}
    >
      {resolvedIcon ? <div aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 [&_svg]:h-5 [&_svg]:w-5">{resolvedIcon}</div> : null}
      <div className="flex-1">
        {title ? <div className="font-medium">{title}</div> : null}
        {children ? <div className={cn(title ? 'mt-1' : undefined, 'opacity-90')}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-m-1 shrink-0 rounded-[var(--radius-selector)] p-1 opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </Primitive>
  );
});

Alert.displayName = 'Alert';

export { Alert, alertVariants };
export type { AlertProps };
