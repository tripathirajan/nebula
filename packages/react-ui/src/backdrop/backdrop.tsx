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

const BLUR_TINT_OPACITY: Record<BackdropBlurIntensity, number> = {
  subtle: 25,
  regular: 20,
  strong: 15,
};

/**
 * The actual solid/blur styling decision, factored out so `Backdrop` isn't
 * the only place it lives. `DialogOverlay`/`DrawerOverlay` can't literally
 * render a `<Backdrop>` element internally — their headless counterparts
 * already fuse `Presence` + `Overlay` together with `data-state`/`ref`
 * wiring tied to dialog/drawer context, so there's no seam to nest a second
 * component into — but they still call this exact function, so "what does
 * blur vs. solid actually look like" has exactly one definition regardless
 * of which token backs it.
 *
 * @param variant - `'solid'` or `'blur'`, same contract as `Backdrop`'s own prop.
 * @param bgVar - The token to tint with, as a `var(--...)` CSS value — defaults to `Backdrop`'s own `--backdrop-bg`, but `DialogOverlay`/`DrawerOverlay` pass their own `--dialog-overlay-bg`/`--drawer-overlay-bg` instead.
 * @param blurIntensity - Same contract as `Backdrop`'s own `blurIntensity` prop; ignored when `variant="solid"`.
 */
function backdropVariantClassName(
  variant: 'solid' | 'blur' = 'solid',
  bgVar = 'var(--backdrop-bg)',
  blurIntensity: BackdropBlurIntensity = 'regular',
): string {
  return variant === 'blur'
    ? `bg-[${bgVar}]/${BLUR_TINT_OPACITY[blurIntensity]} ${BLUR_INTENSITY[blurIntensity]}`
    : `bg-[${bgVar}]/50`;
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
  const { className, variant = 'solid', blurIntensity = 'regular', ...rest } = props;

  return (
    <Overlay
      aria-hidden="true"
      className={cn('z-[var(--z-overlay)]', backdropVariantClassName(variant, undefined, blurIntensity), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Backdrop.displayName = 'Backdrop';

export { Backdrop, backdropVariantClassName };
export type { BackdropProps, BackdropBlurIntensity };
