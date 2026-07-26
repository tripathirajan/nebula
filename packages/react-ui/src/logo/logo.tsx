import * as React from 'react';

type LogoProps = React.SVGProps<SVGSVGElement> & {
  /** Pixel size for both width and height — the mark's viewBox is square. Ignored if `width`/`height` are passed explicitly. @default 24 */
  size?: number;
};

/**
 * The nebula wordmark's icon — an original four-point sparkle/star mark
 * (not a literal "N" letterform), picked to evoke the project's own name
 * rather than trace a specific external reference. Renders with
 * `fill="currentColor"`, so it follows whatever CSS `color` is in scope
 * (typically `--color-base-content`, which is already theme-aware, or a
 * fixed brand color like `--color-primary`) rather than shipping separate
 * light/dark asset files — one component, both themes, the same pattern
 * every other icon in this package uses (see `theme-switcher.tsx`'s
 * `SunIcon`/`MoonIcon`).
 *
 * @example
 * ```tsx
 * <Logo />
 * <Logo size={32} className="text-[var(--color-primary)]" />
 * // Explicit color instead of inheriting:
 * <Logo className="text-white" />
 * ```
 */
const Logo = React.forwardRef<SVGSVGElement, LogoProps>((props, forwardedRef) => {
  const { size = 24, ...rest } = props;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      ref={forwardedRef}
    >
      <path d="M 50 4 C 52 34 56 44 88 50 C 56 56 52 66 50 96 C 48 66 44 56 12 50 C 44 44 48 34 50 4 Z" />
    </svg>
  );
});

Logo.displayName = 'Logo';

export { Logo };
export type { LogoProps };
