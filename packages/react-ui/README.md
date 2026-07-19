# @nebula-lab/react-ui

Tailwind-powered styled components (atoms) built on `@nebula-lab/primitives` (`Primitive`, `cn`) and `@nebula-lab/headless` (for anything with interactive/ARIA state beyond what `Primitive` gives for free) — plus the 3-layer design token system and `ThemeProvider`/`useTheme` those components are styled from.

This package absorbed the former `@nebula-lab/theme` package. Tokens/theming were split out on their own early on, but no other package in the workspace ever needed them — `primitives` and `headless` are intentionally unstyled and never touch color/spacing tokens at all, so `@nebula-lab/theme` only ever had one real consumer (`react-ui` itself, plus `react-ui-blocks` transitively through it). Keeping them separate was a package boundary with no other package depending on it, so they're merged now. (Trade-off worth knowing: this does mean tokens can no longer be consumed independently of the React component code, e.g. by a future non-React consumer — a reasonable cost given there's only one implementation today.) `@nebula-lab/headless` has also been renamed twice since — `@nebula-lab/headless` → `@nebula-lab/styleless` → back to `@nebula-lab/headless` — see that package's own README and `AGENTS.md`'s "Layer placement" section for why it landed back on `headless` for good this time (a distinct, new `@nebula-lab/styleless` layer now exists conceptually, just not built yet).

## Installation

```bash
npm install @nebula-lab/react-ui
# or
yarn add @nebula-lab/react-ui
# or
pnpm add @nebula-lab/react-ui
# or
bun add @nebula-lab/react-ui
```

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`. Requires Tailwind CSS v4 in the consuming app (see Import below) since components' classes reference `theme.css`'s CSS custom properties. Works with any of the above package managers — pick whichever your project already uses.

**Module format:** ESM only (no CommonJS build). Works out of the box with any bundler (Vite, Next.js, Webpack 5+, esbuild, Parcel) or native Node.js ESM. A plain CommonJS `require('@nebula-lab/react-ui')` is **not** supported and throws `ERR_REQUIRE_ESM` — use `import` (or dynamic `import()` from a CJS file) instead.

**TypeScript / JavaScript:** Ships hand-written `.d.ts` types alongside the JS output, but nothing requires TypeScript — plain JavaScript works identically (props just won't be type-checked/autocompleted without a TS-aware editor). Every example in this README is TypeScript (`.tsx`) but drops in as plain JSX with the types simply ignored.

## What's here

**Layout & structure** — `Card`, `Paper`, `Surface`, `Section`, `Main`, `Header`, `Footer`, `Navbar`, `Sidebar`, `DescriptionList`

**Typography** — `Heading`, `Text`, `Blockquote`, `Code`, `Markdown`, `Kbd`, `KbdShortcut`

**Buttons** — `Button`, `IconButton`, `Fab`, `ButtonGroup`, `SplitButton`

**Forms — text input** — `Input`, `Textarea`, `EmailField`, `TelField`, `UrlField`, `PasswordField`, `SearchField`, `PasswordStrengthIndicator`, `NumberInput`, `OtpInput`

**Forms — selection** — `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `SegmentedControl`, `Select`, `MultiSelect`, `Combobox`, `Autocomplete`, `ColorPicker`, `Rating`, `StaticRating`, `Slider`

**Forms — date & time** — `Calendar`, `DatePicker`, `DateRangePicker`, `TimePicker`

**Forms — file** — `FileUpload`, `ImageUpload`

**Forms — misc** — `Field`, `FilterBar`, `Command`

**Feedback** — `Alert`, `AlertPopup`, `Toast`, `Progress`, `CircularProgress`, `Spinner`, `Skeleton`, `EmptyState`

**Overlays** — `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `HoverCard`, `Tooltip`, `Backdrop` (standalone frosted-glass/solid scrim, usable anywhere)

**Menus** — `Menu`, `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu`

**Navigation** — `Tabs`, `Breadcrumb`, `Pagination`, `Stepper`, `BottomNav`, `Timeline`

**Data display** — `Badge`, `Chip`, `Tag`, `Avatar`, `AvatarGroup`, `DataTable`, `DataGrid`, `Tree`, `TreeView`, `TreeTable`, `List`, `VirtualList`, `Stat`, `Sparkline`, `CodeBlock`

**Media & carousels** — `Audio`, `Video`, `Carousel`, `SwipeableCards`

**Disclosure** — `Accordion`, `Collapsible`

**Drag & drop** — `Draggable`, `Droppable`, `Sortable`

**Theming** — `ThemeProvider` + `useTheme()` (persists via `@nebula-lab/hooks`'s `useLocalStorage`, resolves `'system'` via `useMediaQuery`, reflects `data-theme` + `.dark` on `<html>`), `ThemeSwitcher`, and the token system (`tokens/primitive.ts`, `tokens/semantic.ts`, `tokens/component.ts` — see "Custom theming" below)

**Utility** — `Separator`

## Import

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, ThemeProvider } from '@nebula-lab/react-ui';
import '@nebula-lab/react-ui/theme.css'; // required once — components' classes reference theme.css's CSS vars

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

Every component also has its own subpath export (e.g. `@nebula-lab/react-ui/button`, `/card`, `/dialog`, `/tokens`, `/theme-provider`) for consumers who want to import just one component's chunk rather than the whole barrel.

## Custom theming / color schemes

Yes — this is designed for it. Every color a component reads comes from a CSS custom property (`--color-primary`, `--button-primary-bg`, ...), never a hardcoded Tailwind class or hex value baked into a component. There are three ways to customize, in order of how much control (and effort) each gives you.

Colors are OKLCH (`oklch(lightness chroma hue)`), and the whole token vocabulary (`base-100/200/300` + `-content`, `primary`/`secondary`/`accent`/`neutral` + `-content`, `info`/`success`/`warning`/`error` + `-content`, per-component `radius`/`size` roles, `border`/`depth`/`noise`, `font-sans`/`font-heading`/`font-mono`) follows the DaisyUI theme-file convention rather than the older hex/Tailwind-gray palette — adopted wholesale (not just "inspired by") per a design decision to standardize on it as nebula's base theme. `color-scheme: light`/`dark` is also set as a real CSS property (not a custom property) in each mode, so native form controls and scrollbars render correctly too, not just this package's own components.

### 1. Override the CSS variables (recommended for most apps — no rebuild)

`theme.css` sets these on `:root` (light) and on `.dark`/`[data-theme="dark"]` (dark — either selector works; `ThemeProvider` sets both). A consuming app — e.g. an expense-tracker PWA that wants its own brand color instead of nebula's default orange — can add its own stylesheet **after** importing `theme.css` and override exactly the variables it cares about:

```css
@import 'tailwindcss';
@import '@nebula-lab/react-ui/theme.css';

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

CSS custom properties cascade normally — later declarations win, and you only need to override the tokens you actually want to change; everything else keeps nebula's defaults. This works at runtime, requires no changes to `@nebula-lab/*` source, and is safe to do per-app, per-tenant, or even per-route (scope the override to a class/attribute selector instead of `:root` for that). Whatever primary color you pick, re-run (or hand-check) the contrast math in `contrast-audit.ts` against your own values — see `CONTRAST_AUDIT.md` for real, current failures in nebula's *own* default primary/accent pairing that this port inherited as-is.

### 2. Fork the token source (more control, needs a build step)

`tokens/primitive.ts` / `semantic.ts` / `component.ts` are plain, typed objects, and `generate.ts` is a script that flattens them into CSS. An app that wants many custom tokens, wants them type-checked and code-reviewed rather than living in a loose CSS override, or wants to add entirely new semantic categories, can maintain its own copy of the semantic/component layer (importing this package's `primitiveTokens`, or replacing it too) and run the equivalent of `generate-tokens` to produce its own `theme.css`. More setup, but gives full type safety and keeps token changes in version control as data, not scattered CSS overrides.

### 3. Per-instance overrides via `className`

Every component here accepts `className`, merged via `cn()` (`clsx` + `tailwind-merge`), so one-off visual differences don't require touching tokens at all — conflicting Tailwind utility classes on a specific instance win over the component's defaults.

### Current limitation: only two color modes, not arbitrary named themes

`ThemeProvider`/`useTheme`'s `Theme` type is currently a fixed union — `'light' | 'dark' | 'system'` — not an arbitrary string. Approach #1 above works today for reskinning light/dark with a single brand's colors (as shown), but if you want multiple **selectable** named themes (e.g. a white-label app offering "Ocean"/"Sunset"/"Forest" schemes, not just light/dark), `ThemeProvider` doesn't have a slot for that yet — you'd currently need to bypass it and manage your own `data-theme`/`.dark` value/CSS blocks. Widening `Theme` to `string` (or a generic type param) and updating `theme-provider.tsx` accordingly would be a small, backwards-compatible change if this comes up — flagging it here rather than pretending it's already supported.

## Adding the next component

Most components here should be a thin `cva` + `cn` wrapper around either a `Primitive.<tag>` (for stateless components like `Button`, `Badge`, `Card`) or the matching `@nebula-lab/headless` component (for anything stateful/ARIA-heavy, e.g. the styled `Checkbox`/`Switch`/`RadioGroup` wrapping `@nebula-lab/headless`'s versions). See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md) for the full convention, including how to regenerate design tokens.

## API reference

Every component here ships with a live Storybook entry (controls, source, interaction tests) — that's the authoritative API reference, not this README: **https://tripathirajan.github.io/nebula/**

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
