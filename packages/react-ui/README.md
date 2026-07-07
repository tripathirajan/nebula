# @nebula/react-ui

Tailwind-powered styled components (atoms) built on `@nebula/primitives` (`Primitive`, `cn`) and `@nebula/headless` (for anything with interactive/ARIA state beyond what `Primitive` gives for free) — plus the 3-layer design token system and `ThemeProvider`/`useTheme` those components are styled from.

This package absorbed the former `@nebula/theme` package. Tokens/theming were split out on their own early on, but no other package in the workspace ever needed them — `primitives` and `headless` are intentionally unstyled and never touch color/spacing tokens at all, so `@nebula/theme` only ever had one real consumer (`react-ui` itself, plus `react-ui-blocks` transitively through it). Keeping them separate was a package boundary with no other package depending on it, so they're merged now. (Trade-off worth knowing: this does mean tokens can no longer be consumed independently of the React component code, e.g. by a future non-React consumer — a reasonable cost given there's only one implementation today.) `@nebula/headless` has also been renamed twice since — `@nebula/headless` → `@nebula/styleless` → back to `@nebula/headless` — see that package's own README and `AGENTS.md`'s "Layer placement" section for why it landed back on `headless` for good this time (a distinct, new `@nebula/styleless` layer now exists conceptually, just not built yet).

## What's here

- `Button` — `cva`-driven `variant` (`primary` | `secondary` | `danger`) / `size` (`sm` | `md` | `lg`) API, `loading` state, `asChild` support.
- `Input` — styled wrapper over `@nebula/primitives`' unstyled `Input` (`invalid` -> `aria-invalid` wiring, ref forwarding).
- `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` — bordered container, purely presentational (no matching `@nebula/headless` compound needed).
- `Badge` — small status/count pill, exposes all eight semantic color roles (`primary`/`secondary`/`accent`/`neutral`/`info`/`success`/`warning`/`danger`) as variants, unlike `Button`'s three — it's the component meant to show off the full palette.
- `Avatar` / `AvatarImage` / `AvatarFallback` — image-with-fallback (Radix-style), tracks image load/error state itself so the fallback (initials, icon, ...) only shows when there's no successfully-loaded image; `AvatarFallback` takes an optional `delayMs` to avoid flashing on fast loads.
- `Separator` — horizontal/vertical rule; `decorative` (default) renders `role="none"`, `decorative={false}` renders `role="separator"` with `aria-orientation`.
- `Accordion` / `AccordionItem` / `AccordionHeader` / `AccordionTrigger` / `AccordionContent` — styled wrapper over `@nebula/headless`'s `Accordion`; adds a chevron (inline SVG, no icon dependency) that rotates off `data-state`, hover/focus styling, and the border between items. All ARIA/keyboard behavior is unchanged from the underlying `headless` component.
- `Dialog` / `DialogTrigger` / `DialogPortal` / `DialogOverlay` / `DialogContent` / `DialogTitle` / `DialogDescription` / `DialogClose` — styled wrapper over `@nebula/headless`'s `Dialog`. `DialogContent` renders a built-in icon close button by default (`hideCloseButton` to omit it). `Dialog`/`DialogTrigger`/`DialogPortal` have no visual chrome of their own, so they're re-exported from `@nebula/headless` as-is rather than wrapped with nothing to add.
- `Popover` / `PopoverTrigger` / `PopoverPortal` / `PopoverContent` / `PopoverClose` — same pattern as `Dialog`, over `@nebula/headless`'s `Popover` (anchor-positioned, non-modal).
- `Tooltip` / `TooltipTrigger` / `TooltipPortal` / `TooltipContent` — same pattern, over `@nebula/headless`'s `Tooltip` (hover/focus-driven, delay-open). Styled off the `neutral`/`neutral-content` semantic pair rather than `Popover`/`Dialog`'s `base-100`/`base-content`, so it visually pops off the page.
- `Tabs` / `TabList` / `Tab` / `TabPanel` — styled wrapper over `@nebula/headless`'s `Tabs`; adds the underline treatment (a `data-[state=active]`-driven 2px bottom border overlapping `TabList`'s own border via `-mb-px`). All keyboard/activation-mode behavior is unchanged from the underlying `headless` component.
- `Checkbox` — styled wrapper over `@nebula/headless`'s `Checkbox`; renders a checkmark/dash indicator icon toggled via `data-state`, no separate indicator subcomponent needed.
- `Switch` — styled wrapper over `@nebula/headless`'s `Switch`; a track + sliding thumb `<span>`, same `data-state`-driven technique as `Checkbox`.
- `RadioGroup` / `RadioGroupItem` — styled wrapper over `@nebula/headless`'s `RadioGroup`. Note `RadioGroupItem` renders its indicator circle *before* its own `children` — the underlying `headless` item's children are its accessible name/visible label (not a separate `<label>` element), so both live inside the one clickable control.
- `tokens/primitive.ts` — raw OKLCH color values, per-component radius/size roles, and font stacks. Never reference these directly from a component — DaisyUI-style theme, ported from a theme file the project owner provided (see "Custom theming" below for the full story on why OKLCH/DaisyUI over the old hex scale).
- `tokens/semantic.ts` — intent-based roles (`color.primary`, `color.base[100]`, `color.error`, ...) with light/dark mappings, plus the native `color-scheme` property value per mode. Components should reference these.
- `tokens/component.ts` — every styled component's own `<component>Tokens` entry (e.g. `badgeTokens`, `dialogTokens`) — every component reads its colors through this layer (`var(--badge-primary-bg)`), never a semantic token directly, so overriding one component's look can never accidentally also affect another that happens to read the same semantic color. See that file's header comment for the full reasoning.
- `tokens/generate.ts` — regenerates `theme.css` from the three files above.
- `theme-provider/` — `ThemeProvider` + `useTheme()`, persists the choice via `@nebula/hooks`'s `useLocalStorage`, resolves `'system'` via `useMediaQuery`, and reflects it on `<html>` as both `data-theme` and a `.dark` class.

## Import

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, ThemeProvider } from '@nebula/react-ui';
import '@nebula/react-ui/theme.css'; // required once — components' classes reference theme.css's CSS vars

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Save changes?</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="primary" size="md">
            Save changes
          </Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

Every component also has its own subpath export (`@nebula/react-ui/button`, `/card`, `/badge`, `/avatar`, `/separator`, `/accordion`, `/dialog`, `/popover`, `/tooltip`, `/tabs`, `/checkbox`, `/switch`, `/radio-group`, `/input`, `/tokens`, `/theme-provider`) for consumers who want to import just one component's chunk rather than the whole barrel.

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

Yes — this is designed for it. Every color a component reads comes from a CSS custom property (`--color-primary`, `--button-primary-bg`, ...), never a hardcoded Tailwind class or hex value baked into a component. There are three ways to customize, in order of how much control (and effort) each gives you.

Colors are OKLCH (`oklch(lightness chroma hue)`), and the whole token vocabulary (`base-100/200/300` + `-content`, `primary`/`secondary`/`accent`/`neutral` + `-content`, `info`/`success`/`warning`/`error` + `-content`, per-component `radius`/`size` roles, `border`/`depth`/`noise`, `font-sans`/`font-heading`/`font-mono`) follows the DaisyUI theme-file convention rather than the older hex/Tailwind-gray palette — adopted wholesale (not just "inspired by") per a design decision to standardize on it as nebula's base theme. `color-scheme: light`/`dark` is also set as a real CSS property (not a custom property) in each mode, so native form controls and scrollbars render correctly too, not just this package's own components.

### 1. Override the CSS variables (recommended for most apps — no rebuild)

`theme.css` sets these on `:root` (light) and on `.dark`/`[data-theme="dark"]` (dark — either selector works; `ThemeProvider` sets both). A consuming app — e.g. an expense-tracker PWA that wants its own brand color instead of nebula's default orange — can add its own stylesheet **after** importing `theme.css` and override exactly the variables it cares about:

```css
@import 'tailwindcss';
@import '@nebula/react-ui/theme.css';

:root {
  --color-primary: oklch(58% 0.2 275); /* swap brand indigo in for the default orange */
  --color-primary-content: oklch(98% 0 0);
  --button-primary-bg: var(--color-primary);
  --button-primary-text: var(--color-primary-content);
  --button-primary-border: var(--color-primary);
}

.dark {
  --color-primary: oklch(72% 0.19 275);
  --button-primary-bg: var(--color-primary);
}
```

CSS custom properties cascade normally — later declarations win, and you only need to override the tokens you actually want to change; everything else keeps nebula's defaults. This works at runtime, requires no changes to `@nebula/*` source, and is safe to do per-app, per-tenant, or even per-route (scope the override to a class/attribute selector instead of `:root` for that). Whatever primary color you pick, re-run (or hand-check) the contrast math in `contrast-audit.ts` against your own values — see `CONTRAST_AUDIT.md` for real, current failures in nebula's *own* default primary/accent pairing that this port inherited as-is.

### 2. Fork the token source (more control, needs a build step)

`tokens/primitive.ts` / `semantic.ts` / `component.ts` are plain, typed objects, and `generate.ts` is a script that flattens them into CSS. An app that wants many custom tokens, wants them type-checked and code-reviewed rather than living in a loose CSS override, or wants to add entirely new semantic categories, can maintain its own copy of the semantic/component layer (importing this package's `primitiveTokens`, or replacing it too) and run the equivalent of `generate-tokens` to produce its own `theme.css`. More setup, but gives full type safety and keeps token changes in version control as data, not scattered CSS overrides.

### 3. Per-instance overrides via `className`

Every component here accepts `className`, merged via `cn()` (`clsx` + `tailwind-merge`), so one-off visual differences don't require touching tokens at all — conflicting Tailwind utility classes on a specific instance win over the component's defaults.

### Current limitation: only two color modes, not arbitrary named themes

`ThemeProvider`/`useTheme`'s `Theme` type is currently a fixed union — `'light' | 'dark' | 'system'` — not an arbitrary string. Approach #1 above works today for reskinning light/dark with a single brand's colors (as shown), but if you want multiple **selectable** named themes (e.g. a white-label app offering "Ocean"/"Sunset"/"Forest" schemes, not just light/dark), `ThemeProvider` doesn't have a slot for that yet — you'd currently need to bypass it and manage your own `data-theme`/`.dark` value/CSS blocks. Widening `Theme` to `string` (or a generic type param) and updating `theme-provider.tsx` accordingly would be a small, backwards-compatible change if this comes up — flagging it here rather than pretending it's already supported.

## Adding the next component

Most components here should be a thin `cva` + `cn` wrapper around either a `Primitive.<tag>` (for stateless components like `Button`, `Badge`, `Card`) or the matching `@nebula/headless` component (for anything stateful/ARIA-heavy, e.g. the styled `Checkbox`/`Switch`/`RadioGroup` wrapping `@nebula/headless`'s versions). See the `new-component` skill.
