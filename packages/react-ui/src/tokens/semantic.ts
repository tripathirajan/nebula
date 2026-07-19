import { primitiveTokens } from './primitive';

/**
 * Layer 2 — semantic tokens: intent-based roles (`base`/`primary`/`accent`/
 * `success`/...) over the primitive OKLCH values. Components should
 * reference these, never `primitiveTokens` directly — this is the layer
 * light/dark mappings live on, so a component styled with `color.primary`
 * gets dark mode for free.
 *
 * `colorScheme` is the native CSS `color-scheme` property value (not a
 * custom property) — `generate.ts` emits it literally rather than flattening
 * it into `--color-scheme`, so form controls, scrollbars, and other
 * browser-drawn UI pick the right native light/dark rendering too.
 */
const light = {
  colorScheme: 'light',
  color: {
    base: {
      100: primitiveTokens.color.base.light100,
      200: primitiveTokens.color.base.light200,
      300: primitiveTokens.color.base.light300,
      content: primitiveTokens.color.base.lightContent,
    },
    primary: primitiveTokens.color.primary.light,
    primaryContent: primitiveTokens.color.primaryContent.light,
    secondary: primitiveTokens.color.secondary,
    secondaryContent: primitiveTokens.color.secondaryContent,
    accent: primitiveTokens.color.accent,
    accentContent: primitiveTokens.color.accentContent,
    neutral: primitiveTokens.color.neutral.light,
    neutralContent: primitiveTokens.color.neutral.lightContent,
    info: primitiveTokens.color.info,
    infoContent: primitiveTokens.color.infoContent,
    success: primitiveTokens.color.success.light,
    successContent: primitiveTokens.color.success.lightContent,
    warning: primitiveTokens.color.warning,
    warningContent: primitiveTokens.color.warningContent.light,
    error: primitiveTokens.color.error.light,
    errorContent: primitiveTokens.color.error.lightContent,
    successText: primitiveTokens.color.successText.light,
    errorText: primitiveTokens.color.errorText.light,
  },
} as const;

const dark = {
  colorScheme: 'dark',
  color: {
    base: {
      100: primitiveTokens.color.base.dark100,
      200: primitiveTokens.color.base.dark200,
      300: primitiveTokens.color.base.dark300,
      content: primitiveTokens.color.base.darkContent,
    },
    primary: primitiveTokens.color.primary.dark,
    primaryContent: primitiveTokens.color.primaryContent.dark,
    secondary: primitiveTokens.color.secondary,
    secondaryContent: primitiveTokens.color.secondaryContent,
    accent: primitiveTokens.color.accent,
    accentContent: primitiveTokens.color.accentContent,
    neutral: primitiveTokens.color.neutral.dark,
    neutralContent: primitiveTokens.color.neutral.darkContent,
    info: primitiveTokens.color.info,
    infoContent: primitiveTokens.color.infoContent,
    success: primitiveTokens.color.success.dark,
    successContent: primitiveTokens.color.success.darkContent,
    warning: primitiveTokens.color.warning,
    warningContent: primitiveTokens.color.warningContent.dark,
    error: primitiveTokens.color.error.dark,
    errorContent: primitiveTokens.color.error.darkContent,
    successText: primitiveTokens.color.successText.dark,
    errorText: primitiveTokens.color.errorText.dark,
  },
} as const;

/**
 * The full semantic token tree for both themes, keyed by mode.
 *
 * @example
 * ```ts
 * import { semanticTokens } from '@nebula-lab/react-ui/tokens';
 *
 * // Consumed by generate.ts to emit `:root` / `.dark` CSS vars — components
 * // should read the resulting `var(--color-...)` custom properties rather
 * // than importing this object directly.
 * const darkPrimary = semanticTokens.dark.color.primary;
 * ```
 */
const semanticTokens = { light, dark } as const;

export { semanticTokens };
