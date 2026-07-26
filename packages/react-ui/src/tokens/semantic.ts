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
 *
 * `primary`/`primaryContent`/`success`/`successContent`/`warningContent`/
 * `error`/`errorContent`/`grey` are now theme-independent lookups (no
 * `.light`/`.dark` on the primitive) — the reskin's real, measured finding
 * (see the design doc's §Color) is that these are literally the same value
 * in both themes on the source kit, not a coincidence to work around.
 * `base`/`neutral`/`secondary*`/`accent*`/`*Text` keep the `.light`/`.dark`
 * split — those genuinely differ per theme.
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
    primary: primitiveTokens.color.primary,
    primaryContent: primitiveTokens.color.primaryContent,
    primaryText: primitiveTokens.color.primaryText.light,
    primaryLightest: primitiveTokens.color.primaryLightest,
    primaryLighter: primitiveTokens.color.primaryLighter,
    primaryLight: primitiveTokens.color.primaryLight,
    primaryDark: primitiveTokens.color.primaryDark,
    primaryDarker: primitiveTokens.color.primaryDarker,
    primaryDarkest: primitiveTokens.color.primaryDarkest,
    secondary: primitiveTokens.color.secondary,
    secondaryContent: primitiveTokens.color.secondaryContent,
    secondaryText: primitiveTokens.color.secondaryText.light,
    accent: primitiveTokens.color.accent,
    accentContent: primitiveTokens.color.accentContent,
    accentText: primitiveTokens.color.accentText.light,
    neutral: primitiveTokens.color.neutral.light,
    neutralContent: primitiveTokens.color.neutral.lightContent,
    info: primitiveTokens.color.info,
    infoContent: primitiveTokens.color.infoContent,
    infoText: primitiveTokens.color.infoText.light,
    success: primitiveTokens.color.success,
    successContent: primitiveTokens.color.successContent,
    successText: primitiveTokens.color.successText.light,
    warning: primitiveTokens.color.warning,
    warningContent: primitiveTokens.color.warningContent,
    warningText: primitiveTokens.color.warningText.light,
    error: primitiveTokens.color.error,
    errorContent: primitiveTokens.color.errorContent,
    errorText: primitiveTokens.color.errorText.light,
    grey: primitiveTokens.color.grey,
  },
  elevation: {
    card: primitiveTokens.elevation.card.light,
    anchored: primitiveTokens.elevation.anchored.light,
    modal: primitiveTokens.elevation.modal.light,
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
    primary: primitiveTokens.color.primary,
    primaryContent: primitiveTokens.color.primaryContent,
    primaryText: primitiveTokens.color.primaryText.dark,
    primaryLightest: primitiveTokens.color.primaryLightest,
    primaryLighter: primitiveTokens.color.primaryLighter,
    primaryLight: primitiveTokens.color.primaryLight,
    primaryDark: primitiveTokens.color.primaryDark,
    primaryDarker: primitiveTokens.color.primaryDarker,
    primaryDarkest: primitiveTokens.color.primaryDarkest,
    secondary: primitiveTokens.color.secondary,
    secondaryContent: primitiveTokens.color.secondaryContent,
    secondaryText: primitiveTokens.color.secondaryText.dark,
    accent: primitiveTokens.color.accent,
    accentContent: primitiveTokens.color.accentContent,
    accentText: primitiveTokens.color.accentText.dark,
    neutral: primitiveTokens.color.neutral.dark,
    neutralContent: primitiveTokens.color.neutral.darkContent,
    info: primitiveTokens.color.info,
    infoContent: primitiveTokens.color.infoContent,
    infoText: primitiveTokens.color.infoText.dark,
    success: primitiveTokens.color.success,
    successContent: primitiveTokens.color.successContent,
    successText: primitiveTokens.color.successText.dark,
    warning: primitiveTokens.color.warning,
    warningContent: primitiveTokens.color.warningContent,
    warningText: primitiveTokens.color.warningText.dark,
    error: primitiveTokens.color.error,
    errorContent: primitiveTokens.color.errorContent,
    errorText: primitiveTokens.color.errorText.dark,
    grey: primitiveTokens.color.grey,
  },
  elevation: {
    card: primitiveTokens.elevation.card.dark,
    anchored: primitiveTokens.elevation.anchored.dark,
    modal: primitiveTokens.elevation.modal.dark,
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
