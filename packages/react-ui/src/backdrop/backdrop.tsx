import { cn } from '@nebula-lab/primitives/cn';
import { Overlay } from '@nebula-lab/primitives/overlay';
import * as React from 'react';

import type { OverlayProps } from '@nebula-lab/primitives/overlay';

/** `variant="blur"`'s three intensity levels — blur radius + saturation boost + tint opacity move together, not independently, since a lighter blur needs less saturation compensation and reads better with a bit more tint (less material behind it means less color to filter through). */
type BackdropBlurIntensity = 'subtle' | 'regular' | 'strong';

interface BackdropOwnProps {
  /**
   * `'solid'` (the default) is a flat tint at 50% opacity — the classic
   * modal-barrier scrim. `'blur'` is a real frosted-glass material (iOS
   * "vibrancy"/Material "scrim + blur" style), not just a blurred solid:
   * a plain `backdrop-blur` alone reads as flat gray mush, because blurring
   * without also boosting saturation crushes whatever color is behind it
   * towards gray — the same reason a photo looks washed out through frosted
   * shower glass. `backdrop-saturate-150` compensates for that, and the
   * tint drops to 20% (vs. solid's 50%) so more of that saturated color
   * actually shows through instead of being muddied by too much dark wash.
   * @default 'solid'
   */
  variant?: 'solid' | 'blur';
  /**
   * How strong the frosted-glass effect reads — ignored when `variant="solid"`.
   * `'subtle'` (12px blur) suits a lightweight surface where the backdrop
   * shouldn't fight for attention (a search palette, a quick popover-like
   * dialog); `'regular'` (24px, the default, unchanged from before this prop
   * existed) suits most modals; `'strong'` (40px) reads as heavier vibrancy
   * for a hero-weight surface that should fully separate from the page
   * behind it. Each step raises `backdrop-saturate` and tint opacity
   * slightly alongside the blur radius — see this file's `BLUR_INTENSITY`
   * for the exact values, kept together since they were tuned as one
   * treatment per level, not independent axes.
   * @default 'regular'
   */
  blurIntensity?: BackdropBlurIntensity;
}

type BackdropProps = OverlayProps & BackdropOwnProps;

const BLUR_INTENSITY: Record<BackdropBlurIntensity, string> = {
  subtle: 'backdrop-blur-md backdrop-saturate-125',
  regular: 'backdrop-blur-xl backdrop-saturate-150',
  strong: 'backdrop-blur-2xl backdrop-saturate-[2]',
};

// Every branch here is a complete, literal string — Tailwind's JIT scanner
// extracts candidate class names via static text matching against the
// built output, so a class assembled via `` `bg-[${bgVar}]/50` `` (this
// function's previous shape) is invisible to it and silently never
// generates a CSS rule, same pitfall `button.tsx`'s own `buttonVariants`
// comment documents — confirmed as a real, shipped bug here: every
// `Dialog`/`Drawer`/`AlertPopup`/`AlertDialog` backdrop rendered fully
// transparent (`getComputedStyle` showed `rgba(0,0,0,0)`) because this
// exact class string never appeared as real text anywhere in the source,
// only as a runtime-interpolated value. `--backdrop-tint` is always this
// same fixed custom-property name in every branch below; which real token
// it points at (`--backdrop-bg`/`--dialog-overlay-bg`/`--drawer-overlay-bg`)
// is set dynamically via the `style` prop instead (see `backdropTintStyle`),
// since inline styles aren't subject to static class-name scanning at all.
const SOLID_TINT_CLASS = 'bg-[color-mix(in_oklch,var(--backdrop-tint)_50%,transparent)]';
const BLUR_TINT_CLASS: Record<BackdropBlurIntensity, string> = {
  subtle: 'bg-[color-mix(in_oklch,var(--backdrop-tint)_25%,transparent)]',
  regular: 'bg-[color-mix(in_oklch,var(--backdrop-tint)_20%,transparent)]',
  strong: 'bg-[color-mix(in_oklch,var(--backdrop-tint)_15%,transparent)]',
};

/**
 * The actual solid/blur styling decision, factored out so `Backdrop` isn't
 * the only place it lives. `DialogOverlay`/`DrawerOverlay` can't literally
 * render a `<Backdrop>` element internally — their headless counterparts
 * already fuse `Presence` + `Overlay` together with `data-state`/`ref`
 * wiring tied to dialog/drawer context, so there's no seam to nest a second
 * component into — but they still call this exact function, so "what does
 * blur vs. solid actually look like" has exactly one definition regardless
 * of which token backs it. Always pair with `backdropTintStyle` (below) —
 * this only returns the opacity/blur classes; the actual tint color comes
 * from the `--backdrop-tint` custom property that `style` sets.
 *
 * @param variant - `'solid'` or `'blur'`, same contract as `Backdrop`'s own prop.
 * @param blurIntensity - Same contract as `Backdrop`'s own `blurIntensity` prop; ignored when `variant="solid"`.
 */
function backdropVariantClassName(
  variant: 'solid' | 'blur' = 'solid',
  blurIntensity: BackdropBlurIntensity = 'regular',
): string {
  return variant === 'blur' ? cn(BLUR_TINT_CLASS[blurIntensity], BLUR_INTENSITY[blurIntensity]) : SOLID_TINT_CLASS;
}

/** Sets `--backdrop-tint` to `bgVar` (a `var(--...)` CSS value) — pass as this element's `style`, alongside `backdropVariantClassName`'s classes, so the static `color-mix(...)` classes above actually tint with the right token. */
function backdropTintStyle(bgVar: string): React.CSSProperties {
  return { '--backdrop-tint': bgVar } as React.CSSProperties;
}

/**
 * The styled counterpart of `@nebula-lab/primitives`' bare `Overlay` (`fixed
 * inset-0`, zero color/blur of its own by design) — a standalone,
 * theme-aware backdrop usable anywhere a full-viewport scrim is needed, not
 * just behind `Dialog`/`Drawer`/`AlertPopup`. Those three call this file's
 * `backdropVariantClassName` (rather than literally rendering a `<Backdrop>`
 * element — their headless counterparts already fuse `Presence`+`Overlay`
 * together with no seam to nest a second component into) so "what does blur
 * vs. solid actually look like" has exactly one definition, while each
 * keeps its own `--dialog-overlay-bg`/`--drawer-overlay-bg` token (see
 * `drawerTokens`'s own comment for why) — `Backdrop`'s `--backdrop-bg` is
 * specifically the default for using it standalone, e.g. behind a bespoke
 * search palette that isn't built on `Dialog` at all.
 *
 * Purely decorative (`aria-hidden="true"` always) — dismiss-on-click,
 * focus-trapping, and portal placement are the job of whatever wraps this
 * (`DismissibleLayer`, `FocusScope`, `Portal`), the same separation of
 * concerns `Overlay`'s own doc comment establishes.
 *
 * @example
 * ```tsx
 * // Standalone, e.g. behind a command-palette search panel:
 * <Portal>
 *   <Backdrop variant="blur" />
 *   <SearchPanelContent />
 * </Portal>
 * ```
 */
const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>((props, forwardedRef) => {
  const { className, style, variant = 'solid', blurIntensity = 'regular', ...rest } = props;

  return (
    <Overlay
      aria-hidden="true"
      className={cn('z-[var(--z-overlay)]', backdropVariantClassName(variant, blurIntensity), className)}
      style={{ ...backdropTintStyle('var(--backdrop-bg)'), ...style }}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Backdrop.displayName = 'Backdrop';

export { Backdrop, backdropVariantClassName, backdropTintStyle };
export type { BackdropProps, BackdropBlurIntensity };
