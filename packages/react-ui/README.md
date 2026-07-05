# @nebula/react-ui

Tailwind-powered styled components (atoms) built on `@nebula/primitives` (`Primitive`, `cn`) and `@nebula/styleless` (for anything with interactive/ARIA state beyond what `Primitive` gives for free) — plus the 3-layer design token system and `ThemeProvider`/`useTheme` those components are styled from.

This package absorbed the former `@nebula/theme` package. Tokens/theming were split out on their own early on, but no other package in the workspace ever needed them — `primitives` and `styleless` are intentionally unstyled and never touch color/spacing tokens at all, so `@nebula/theme` only ever had one real consumer (`react-ui` itself, plus `react-ui-blocks` transitively through it). Keeping them separate was a package boundary with no other package depending on it, so they're merged now. (Trade-off worth knowing: this does mean tokens can no longer be consumed independently of the React component code, e.g. by a future non-React consumer — a reasonable cost given there's only one implementation today.) `@nebula/headless` was also renamed to `@nebula/styleless` around the same time — same package, clearer name.

## What's here

- `Button` — `cva`-driven `variant` (`primary` | `secondary` | `danger`) / `size` (`sm` | `md` | `lg`) API, styled entirely off this package's own `buttonTokens` CSS variables (no hardcoded colors), `loading` state, `asChild` support.
- `tokens/primitive.ts` — raw numeric scales (`gray.500`, `spacing.4`, ...). Never reference these directly from a component.
- `tokens/semantic.ts` — intent-based aliases (`color.bg.default`, `color.text.muted`, ...) with light/dark mappings. Components should reference these.
- `tokens/component.ts` — per-component token overrides for complex multi-variant components (currently: `buttonTokens`). Opt-in.
- `tokens/generate.ts` — regenerates `theme.css` from the two files above.
- `theme-provider/` — `ThemeProvider` + `useTheme()`, persists the choice via `@nebula/hooks`'s `useLocalStorage` and resolves `'system'` via `useMediaQuery`.

## Import

```tsx
import { Button, ThemeProvider } from '@nebula/react-ui';
import '@nebula/react-ui/theme.css'; // required once — Button's classes reference theme.css's CSS vars

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Button variant="primary" size="md">
        Save changes
      </Button>
    </ThemeProvider>
  );
}
```

## Regenerating tokens

Edit `tokens/semantic.ts` (light/dark mappings) or `tokens/component.ts`, then:

```bash
pnpm --filter @nebula/react-ui generate-tokens
```

This overwrites `src/theme.css` — never hand-edit that file. Check contrast after any color change:

```bash
pnpm --filter @nebula/react-ui contrast-audit
```

See `CONTRAST_AUDIT.md` for the current pass/fail state of every semantic color pairing.

## Custom theming / color schemes

Yes — this is designed for it. Every color a component reads comes from a CSS custom property (`--color-bg-interactive`, `--button-primary-bg`, ...), never a hardcoded Tailwind class or hex value baked into a component. There are three ways to customize, in order of how much control (and effort) each gives you.

### 1. Override the CSS variables (recommended for most apps — no rebuild)

`theme.css` sets these on `:root` (light) and `[data-theme="dark"]`. A consuming app — e.g. an expense-tracker PWA that wants its own brand color instead of nebula's default blue — can add its own stylesheet **after** importing `theme.css` and override exactly the variables it cares about:

```css
@import 'tailwindcss';
@import '@nebula/react-ui/theme.css';

:root {
  --color-bg-interactive: #7c3aed; /* swap brand purple in for the default blue */
  --color-bg-interactive-hover: #6d28d9;
  --button-primary-bg: var(--color-bg-interactive);
  --button-primary-bg-hover: var(--color-bg-interactive-hover);
}

[data-theme='dark'] {
  --color-bg-interactive: #a78bfa;
  --button-primary-bg: var(--color-bg-interactive);
}
```

CSS custom properties cascade normally — later declarations win, and you only need to override the tokens you actually want to change; everything else keeps nebula's defaults. This works at runtime, requires no changes to `@nebula/*` source, and is safe to do per-app, per-tenant, or even per-route (scope the override to a class/attribute selector instead of `:root` for that).

### 2. Fork the token source (more control, needs a build step)

`tokens/primitive.ts` / `semantic.ts` / `component.ts` are plain, typed objects, and `generate.ts` is a ~60-line script that flattens them into CSS. An app that wants many custom tokens, wants them type-checked and code-reviewed rather than living in a loose CSS override, or wants to add entirely new semantic categories, can maintain its own copy of the semantic/component layer (importing this package's `primitiveTokens` scale, or replacing it too) and run the equivalent of `generate-tokens` to produce its own `theme.css`. More setup, but gives full type safety and keeps token changes in version control as data, not scattered CSS overrides.

### 3. Per-instance overrides via `className`

Every component here accepts `className`, merged via `cn()` (`clsx` + `tailwind-merge`), so one-off visual differences don't require touching tokens at all — conflicting Tailwind utility classes on a specific instance win over the component's defaults.

### Current limitation: only two color modes, not arbitrary named themes

`ThemeProvider`/`useTheme`'s `Theme` type is currently a fixed union — `'light' | 'dark' | 'system'` — not an arbitrary string. Approach #1 above works today for reskinning light/dark with a single brand's colors (as shown), but if you want multiple **selectable** named themes (e.g. a white-label app offering "Ocean"/"Sunset"/"Forest" schemes, not just light/dark), `ThemeProvider` doesn't have a slot for that yet — you'd currently need to bypass it and manage your own `data-theme` value/CSS blocks. Widening `Theme` to `string` (or a generic type param) and updating `theme-provider.tsx` accordingly would be a small, backwards-compatible change if this comes up — flagging it here rather than pretending it's already supported.

## Adding the next component

Most components here should be a thin `cva` + `cn` wrapper around either a `Primitive.<tag>` (for stateless components like `Button`, `Badge`, `Card`) or the matching `@nebula/styleless` component (for anything stateful/ARIA-heavy, e.g. the styled `Checkbox`/`Switch`/`RadioGroup` wrapping `@nebula/styleless`'s versions). See the `new-component` skill.
