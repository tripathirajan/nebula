/**
 * Layer 3 — component tokens: per-component overrides for components with
 * enough variants to need their own token set (opt-in — most components
 * style directly off semantic tokens and never need an entry here).
 *
 * These values are `var(--color-...)` references into the *semantic* layer
 * rather than raw colors, so they don't need their own light/dark variants —
 * they inherit whichever theme is active automatically through the
 * underlying semantic variable. See `generate.ts` for how this becomes CSS.
 */
const buttonTokens = {
  primary: {
    bg: 'var(--color-bg-interactive)',
    bgHover: 'var(--color-bg-interactive-hover)',
    text: 'var(--color-text-on-interactive)',
    border: 'var(--color-border-interactive)',
  },
  secondary: {
    bg: 'var(--color-bg-subtle)',
    bgHover: 'var(--color-bg-default)',
    text: 'var(--color-text-default)',
    border: 'var(--color-border-default)',
  },
  danger: {
    bg: 'var(--color-status-danger)',
    bgHover: 'var(--color-status-danger)',
    text: 'var(--color-text-on-interactive)',
    border: 'var(--color-status-danger)',
  },
} as const;

/**
 * Aggregated per-component token overrides, keyed by component name.
 *
 * @example
 * ```ts
 * import { componentTokens } from '@nebula/react-ui/tokens';
 *
 * // Emitted as `--button-primary-bg` etc. by generate.ts; consume the CSS
 * // variable in a stylesheet rather than importing this object at runtime.
 * const primaryBg = componentTokens.button.primary.bg;
 * ```
 */
const componentTokens = { button: buttonTokens } as const;

export { componentTokens, buttonTokens };
