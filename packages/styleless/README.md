# @nebula-lab/styleless

Reusable UI components with a complete, semantic API — but zero visual opinion. Composes `@nebula-lab/primitives` + `@nebula-lab/headless`; styled by `@nebula-lab/react-ui`, which wraps each of these and adds Tailwind classes/variants/tokens on top.

This is the newest layer in the pipeline (`primitives → headless → styleless → react-ui → react-ui-blocks`), confirmed via the project owner's decision guide:

```
1. Is it a low-level DOM abstraction?                                        → Primitive
2. Does it solve reusable interaction/state/a11y/keyboard/focus/positioning?  → Headless
3. Is it a reusable UI component composing primitives/headless, unstyled?     → Styleless
4. Does it add the Nebula design system (Tailwind, variants, themes)?        → React UI
```

See `LAYER_TAXONOMY.md` (repo root) for the ongoing extraction plan — components tagged **[extract]** there are currently styled directly in `@nebula-lab/react-ui` and still need an unstyled version factored out into this package.

## Installation

```bash
npm install @nebula-lab/styleless
# or
yarn add @nebula-lab/styleless
# or
pnpm add @nebula-lab/styleless
# or
bun add @nebula-lab/styleless
```

Peer dependencies: `react ^19.0.0`, `react-dom ^19.0.0`. Works with any of the above package managers — pick whichever your project already uses.

**Module format:** ESM only (no CommonJS build). Works out of the box with any bundler (Vite, Next.js, Webpack 5+, esbuild, Parcel) or native Node.js ESM. A plain CommonJS `require('@nebula-lab/styleless')` is **not** supported and throws `ERR_REQUIRE_ESM` — use `import` (or dynamic `import()` from a CJS file) instead.

**TypeScript / JavaScript:** Ships hand-written `.d.ts` types alongside the JS output, but nothing requires TypeScript — plain JavaScript works identically. TypeScript users get full autocomplete/type-checking for free; JavaScript users just don't see the type annotations.

## What's here

**Buttons** — `Button` (real `loading` semantics: `aria-busy`, `data-loading`, forced `disabled`), `IconButton`, `Fab`, `SplitButton`

**Media** — `Avatar`, `AvatarGroup`, `ImagePreview`

**Text input** — `Input`, `Textarea`, `EmailInput`, `TelInput`, `UrlInput`, `PasswordInput`, `SearchInput`, `PasswordStrengthIndicator`

**Data display** — `DataTable`, `DataGrid`, `CodeBlock`

## Import

```tsx
import { Button, Avatar, DataTable } from '@nebula-lab/styleless';
// or per-component subpath
import { Button } from '@nebula-lab/styleless/button';
```

```tsx
<Button onClick={() => {}}>Click me</Button>
<Button loading>Saving…</Button>
```

## API reference

Every component here ships with a live Storybook entry (controls, source, interaction tests) — that's the authoritative API reference, not this README: **https://tripathirajan.github.io/nebula/**

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
