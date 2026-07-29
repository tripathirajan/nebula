
import { cn } from '@nebula-lab/primitives/cn';
import { Button as StylelessButton } from '@nebula-lab/styleless/button';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { ButtonProps as StylelessButtonProps } from '@nebula-lab/styleless/button';
import type { VariantProps } from 'class-variance-authority';

/**
 * Class recipe built on this package's own `buttonTokens` (see
 * `../tokens/component.ts`) via CSS-var-backed Tailwind arbitrary values —
 * swap themes by changing `data-theme`/`.dark`, not by touching this file.
 *
 * Two independent axes: `variant` is the *shape* (`default` solid filled,
 * `ghost` light-tinted with a colored border, `text` colored text only,
 * `link` `text` plus an underline), `color` is the *hue* — every shape/color
 * combination reads the same `buttonTokens.<color>` triple, just applies
 * `bg`/`text`/`border` differently per shape (see `compoundVariants` below),
 * so no per-shape token entries exist. `ghost`/`text`/`link` read a
 * dedicated `--color-<x>-text` token for their text color — a low-lightness
 * (light theme) / raised-lightness (dark theme) shade of the same hue, safe
 * to sit directly on `base.100` — not `-border`/`-content` (the raw hue and
 * the *on-filled-bg* content color respectively; both wrong once there's no
 * filled background to sit on). `primary`/`neutral` are the two exceptions:
 * they keep reading `-border` (the raw hue) because it already happens to
 * be dark/saturated enough to pass as standalone text (14.81:1 / 7.74:1 in
 * light mode) — see `primitive.ts`'s `primary`/`neutral` values — so no
 * separate `-text` token exists for them.
 *
 * This split was originally only fixed for `danger` (`EntityFormLayout`'s
 * danger actions were the first real consumer of `ghost`/`text`-shaped
 * danger buttons, and the raw `--color-error` hue failed contrast as
 * literal text, live-verified via Storybook's a11y panel), with the other 6
 * colors deliberately left on the same broken `-border`-as-text pattern per
 * `CONTRAST_AUDIT.md`'s stated policy of not fixing pairings nothing
 * rendered yet. A real consumer (`expensiona`, `color="warning"` at
 * `variant="text"`) then hit exactly that gap at 1.57:1 — measuring all 8
 * colors found 6 failing (`secondary` 3.28, `accent` 3.67, `danger` was
 * already fixed, `info` 2.22, `success` 1.78, `warning` 1.57), so the fix is
 * now applied uniformly: every color reads its own `-text` token (adding
 * `secondaryText`/`accentText`/`infoText`/`warningText` alongside the
 * pre-existing `successText`/`errorText` in `primitive.ts`), verified via
 * `contrast-audit.ts` in both themes rather than deferred again.
 *
 * Hover state on `default` is `hover:brightness-90` rather than a second
 * stored `-bg-hover` token — the DaisyUI-style token set this package's
 * theme is built from assigns exactly one shade per semantic role (no
 * separate "hover" shade to reference), so darkening via a CSS filter keeps
 * every color's hover state theme-aware for free. `ghost`/`text` use a
 * subtle tinted background instead, written as a full `color-mix(...)`
 * arbitrary value (`bg-[color-mix(in_oklch,var(...)_10%,transparent)]`)
 * rather than Tailwind's `/10` opacity-modifier suffix on an arbitrary
 * `var()` background — that suffix form doesn't reliably generate a rule
 * for arbitrary CSS-variable values in this project's Tailwind setup
 * (confirmed empirically: no matching rule appears in the built CSS),
 * whereas a fully-spelled-out arbitrary value is unambiguous, always
 * generated. `link` just underlines, no tint needed.
 *
 * `shape` is a third independent axis (default `rounded`, reading
 * `--radius-button` same as before; `pill` for a fully-rounded end-to-end
 * button; `square` for no rounding at all) — previously hardcoded into the
 * base class string with no way to override per-instance.
 *
 * `size`'s horizontal padding is aligned to Material Design 3's button
 * spec (`md` — the 40px-height tier M3's base spec directly maps to — uses
 * 24px padding, M3's own stated value for a text-only/icon-less button;
 * `sm`/`lg` scale proportionally off that same ratio, rounded to the
 * nearest step Tailwind's default spacing scale already has, not a new
 * arbitrary value). M3 specifies a tighter 16px when a button has a
 * leading icon — not applied here, since `Button` has no dedicated icon
 * slot to detect that from (children are freeform); every size uses the
 * icon-less number uniformly rather than guessing at icon presence.
 *

 * Focus ring reads `--color-base-content` regardless of `color` — not
 * because `primary` itself fails contrast (recomputed via
 * `contrast-audit.ts`: `primary` vs `base.100` is 14.82:1 in light mode and
 * 3.97:1 in dark mode, both comfortably clearing WCAG 1.4.11's 3:1 non-text
 * minimum — an earlier version of this comment claimed a stale ~2:1 figure
 * from before the palette was finalized to today's dark-navy `primary`, no
 * longer accurate), but because ringing every color the same neutral keeps
 * the ring itself a single, predictable, always-safe visual regardless of
 * which `color` a given `Button` uses — several other colors genuinely do
 * fail as a standalone ring (`CONTRAST_AUDIT.md`'s `error`/`success`/
 * `warning`-on-`base.100` entries all fail even the looser 3:1 bar, e.g.
 * `error` at 2.92:1 — see `alert-dialog-action.tsx`'s own fix for exactly
 * this). `base-content` is guaranteed to invert correctly against `base-100`
 * in both themes (it's the same pairing body text uses) for every color,
 * not just the ones that happen to already pass, at the cost of the ring
 * not being brand-colored.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-base-content)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:brightness-90',
        ghost: 'bg-transparent',
        text: 'border-transparent bg-transparent',
        link: 'border-transparent bg-transparent underline-offset-4 hover:underline',
      },
      color: {
        primary: '',
        secondary: '',
        accent: '',
        neutral: '',
        info: '',
        success: '',
        warning: '',
        danger: '',
      },
      size: {
        sm: 'h-8 px-5 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-7 text-base',
      },
      shape: {
        rounded: 'rounded-[var(--radius-button)]',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    // Every class string below is written out literally (not built from a
    // `${color}` template-literal interpolation) — Tailwind's JIT scanner
    // extracts utility class names via static text matching against the
    // source file, so an interpolated class name like
    // `` `bg-[var(--button-${c}-bg)]` `` is invisible to it and silently
    // never generates a CSS rule (confirmed empirically: some interpolated
    // classes happened to also appear literally elsewhere and worked by
    // coincidence, most didn't and rendered with no background at all).
    compoundVariants: [
      {
        variant: 'default',
        color: 'primary',
        class:
          'border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
      },
      {
        variant: 'ghost',
        color: 'primary',
        // `text-[var(--color-primary-text)]`, not `--button-primary-border`
        // (the raw fill) — real bug caught by Storybook's a11y addon
        // running axe against the actual rendered `ghost` background (a
        // 10% `color-mix` tint, not plain `base-100`): raw `primary` scored
        // 4.24:1 there, just under 4.5:1. `primaryText` was built
        // specifically for "`Button`'s `ghost`/`text`/`link` variants" (see
        // its own doc comment in `primitive.ts`) but never actually got
        // wired up here until now — `contrast-audit.ts`'s token-level check
        // (`primaryText` vs plain `base.100`) couldn't have caught this: the
        // real background here isn't `base.100`, it's the tinted mix, which
        // only a real rendered-DOM check (axe, not a token-value script)
        // can evaluate.
        class:
          'border-[var(--button-primary-border)] bg-[color-mix(in_oklch,var(--button-primary-bg)_10%,transparent)] text-[var(--color-primary-text)] hover:bg-[color-mix(in_oklch,var(--button-primary-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'primary',
        class:
          'text-[var(--color-primary-text)] hover:bg-[color-mix(in_oklch,var(--button-primary-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'primary', class: 'text-[var(--color-primary-text)]' },
      {
        variant: 'default',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)]',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        class:
          'border-[var(--button-secondary-border)] bg-[color-mix(in_oklch,var(--button-secondary-bg)_10%,transparent)] text-[var(--color-secondary-text)] hover:bg-[color-mix(in_oklch,var(--button-secondary-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'secondary',
        class:
          'text-[var(--color-secondary-text)] hover:bg-[color-mix(in_oklch,var(--button-secondary-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'secondary', class: 'text-[var(--color-secondary-text)]' },
      {
        variant: 'default',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[var(--button-accent-bg)] text-[var(--button-accent-text)]',
      },
      {
        variant: 'ghost',
        color: 'accent',
        class:
          'border-[var(--button-accent-border)] bg-[color-mix(in_oklch,var(--button-accent-bg)_10%,transparent)] text-[var(--color-accent-text)] hover:bg-[color-mix(in_oklch,var(--button-accent-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'accent',
        class:
          'text-[var(--color-accent-text)] hover:bg-[color-mix(in_oklch,var(--button-accent-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'accent', class: 'text-[var(--color-accent-text)]' },
      {
        variant: 'default',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[var(--button-neutral-bg)] text-[var(--button-neutral-text)]',
      },
      {
        variant: 'ghost',
        color: 'neutral',
        class:
          'border-[var(--button-neutral-border)] bg-[color-mix(in_oklch,var(--button-neutral-bg)_10%,transparent)] text-[var(--button-neutral-border)] hover:bg-[color-mix(in_oklch,var(--button-neutral-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'neutral',
        class:
          'text-[var(--button-neutral-border)] hover:bg-[color-mix(in_oklch,var(--button-neutral-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'neutral', class: 'text-[var(--button-neutral-border)]' },
      {
        variant: 'default',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[var(--button-info-bg)] text-[var(--button-info-text)]',
      },
      {
        variant: 'ghost',
        color: 'info',
        class:
          'border-[var(--button-info-border)] bg-[color-mix(in_oklch,var(--button-info-bg)_10%,transparent)] text-[var(--color-info-text)] hover:bg-[color-mix(in_oklch,var(--button-info-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'info',
        class:
          'text-[var(--color-info-text)] hover:bg-[color-mix(in_oklch,var(--button-info-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'info', class: 'text-[var(--color-info-text)]' },
      {
        variant: 'default',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[var(--button-success-bg)] text-[var(--button-success-text)]',
      },
      {
        variant: 'ghost',
        color: 'success',
        class:
          'border-[var(--button-success-border)] bg-[color-mix(in_oklch,var(--button-success-bg)_10%,transparent)] text-[var(--color-success-text)] hover:bg-[color-mix(in_oklch,var(--button-success-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'success',
        class:
          'text-[var(--color-success-text)] hover:bg-[color-mix(in_oklch,var(--button-success-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'success', class: 'text-[var(--color-success-text)]' },
      {
        variant: 'default',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[var(--button-warning-bg)] text-[var(--button-warning-text)]',
      },
      {
        variant: 'ghost',
        color: 'warning',
        class:
          'border-[var(--button-warning-border)] bg-[color-mix(in_oklch,var(--button-warning-bg)_10%,transparent)] text-[var(--color-warning-text)] hover:bg-[color-mix(in_oklch,var(--button-warning-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'warning',
        class:
          'text-[var(--color-warning-text)] hover:bg-[color-mix(in_oklch,var(--button-warning-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'warning', class: 'text-[var(--color-warning-text)]' },
      {
        variant: 'default',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[var(--button-danger-bg)] text-[var(--button-danger-text)]',
      },
      {
        variant: 'ghost',
        color: 'danger',
        class:
          'border-[var(--button-danger-border)] bg-[color-mix(in_oklch,var(--button-danger-bg)_10%,transparent)] text-[var(--color-error-text)] hover:bg-[color-mix(in_oklch,var(--button-danger-bg)_20%,transparent)]',
      },
      {
        variant: 'text',
        color: 'danger',
        class:
          'text-[var(--color-error-text)] hover:bg-[color-mix(in_oklch,var(--button-danger-bg)_10%,transparent)]',
      },
      { variant: 'link', color: 'danger', class: 'text-[var(--color-error-text)]' },
    ],
    defaultVariants: {
      variant: 'default',
      color: 'primary',
      size: 'md',
      shape: 'rounded',
    },
  },
);

type ButtonProps = StylelessButtonProps & VariantProps<typeof buttonVariants>;

/**
 * Styled `Button` — the `react-ui` layer's job is purely visual, so this
 * wraps `@nebula-lab/styleless`'s `Button` (which already gives `asChild`
 * support, the `type="button"` default, and real `loading` semantics —
 * `aria-busy`/`data-loading`/forced-`disabled`) rather than reaching for
 * `@nebula-lab/primitives` directly, per the layering in
 * `ARCHITECTURE.md`: `react-ui` builds on `styleless`,
 * not around it. This file's own job is exactly one thing: turning
 * `variant`/`color`/`size` into Tailwind classes via `buttonVariants`.
 *
 * @example
 * ```tsx
 * <Button color="primary" size="md">Save changes</Button>
 * <Button color="danger" loading>Deleting…</Button>
 * <Button asChild color="secondary"><a href="/">Link button</a></Button>
 * <Button variant="ghost" color="neutral">Continue with Google</Button>
 * <Button variant="text" color="primary">Learn more</Button>
 * <Button variant="link" color="primary">Learn more</Button>
 * <Button shape="pill" color="primary">Subscribe</Button>
 * <Button shape="square" color="neutral">Apply filter</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { className, variant, color, size, shape, ...buttonProps } = props;

  return (
    <StylelessButton
      className={cn(buttonVariants({ variant, color, size, shape }), className)}
      {...buttonProps}
      ref={forwardedRef}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
