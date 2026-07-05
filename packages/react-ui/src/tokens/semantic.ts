import { primitiveTokens } from './primitive';

/**
 * Layer 2 — semantic tokens: intent-based aliases (`category.role.variant`)
 * over the primitive scale. Components should reference these, never
 * `primitiveTokens` directly — this is the layer light/dark mappings live
 * on, so a component styled with `color.bg.default` gets dark mode for free.
 */
const light = {
  color: {
    bg: {
      default: primitiveTokens.color.gray[50],
      subtle: '#ffffff',
      interactive: primitiveTokens.color.blue[600],
      interactiveHover: primitiveTokens.color.blue[700],
    },
    text: {
      default: primitiveTokens.color.gray[900],
      muted: primitiveTokens.color.gray[500],
      onInteractive: '#ffffff',
    },
    border: {
      default: primitiveTokens.color.gray[200],
      interactive: primitiveTokens.color.blue[600],
      focus: primitiveTokens.color.blue[500],
    },
    status: {
      danger: primitiveTokens.color.red[600],
      // 700-weight, not 600: green-600/amber-600 read fine as fills but drop
      // below 4.5:1 against `bg.default` when used as text (see
      // `contrast-audit.ts` — this was a real WCAG 1.4.3 failure until this
      // change). Dark mode doesn't have this problem since it renders these
      // on a near-black background instead.
      success: primitiveTokens.color.green[700],
      warning: primitiveTokens.color.amber[700],
    },
  },
} as const;

const dark = {
  color: {
    bg: {
      default: primitiveTokens.color.gray[950],
      subtle: primitiveTokens.color.gray[900],
      interactive: primitiveTokens.color.blue[500],
      interactiveHover: primitiveTokens.color.blue[400],
    },
    text: {
      default: primitiveTokens.color.gray[50],
      muted: primitiveTokens.color.gray[400],
      onInteractive: primitiveTokens.color.gray[950],
    },
    border: {
      default: primitiveTokens.color.gray[800],
      interactive: primitiveTokens.color.blue[500],
      focus: primitiveTokens.color.blue[400],
    },
    status: {
      danger: primitiveTokens.color.red[400],
      success: primitiveTokens.color.green[400],
      warning: primitiveTokens.color.amber[400],
    },
  },
} as const;

/**
 * The full semantic token tree for both themes, keyed by mode.
 *
 * @example
 * ```ts
 * import { semanticTokens } from '@nebula/react-ui/tokens';
 *
 * // Consumed by generate.ts to emit `:root` / `[data-theme="dark"]` CSS vars —
 * // components should read the resulting `var(--color-...)` custom
 * // properties rather than importing this object directly.
 * const darkInteractiveBg = semanticTokens.dark.color.bg.interactive;
 * ```
 */
const semanticTokens = { light, dark } as const;

export { semanticTokens };
