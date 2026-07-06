/**
 * Regenerates `theme.css` from `primitive.ts` + `semantic.ts` + `component.ts`.
 *
 * Run with: `pnpm --filter @nebula/react-ui generate-tokens`
 * (or `npx tsx packages/react-ui/src/tokens/generate.ts` from the repo root,
 * per component-library-architecture.md §7).
 *
 * Unlike `semantic.ts`/`component.ts`, `primitive.ts`'s `radius`/`size`/
 * `effect`/`fontStack` groups (not its `color` group) *are* walked directly
 * here rather than only being referenced by a higher layer — they're
 * theme-independent "shape" tokens with no light/dark variant to compose,
 * so there's no semantic-layer indirection for them to go through.
 *
 * @example
 * ```sh
 * pnpm --filter @nebula/react-ui generate-tokens
 * # -> Wrote 54 tokens to .../packages/react-ui/src/theme.css
 * ```
 */
import { writeFileSync } from 'node:fs';

import { componentTokens } from './component';
import { primitiveTokens } from './primitive';
import { semanticTokens } from './semantic';

type TokenTree = { [key: string]: string | TokenTree };

/**
 * Converts a `camelCase` token key to `kebab-case` for use in a CSS custom
 * property name.
 *
 * @param value - The camelCase identifier, e.g. `'bgInteractive'`.
 * @returns The kebab-case equivalent, e.g. `'bg-interactive'`.
 *
 * @example
 * ```ts
 * toKebabCase('primaryContent'); // 'primary-content'
 * ```
 */
function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Recursively walks a nested token tree into a flat list of
 * `[--custom-property-name, value]` pairs, joining nested keys with `-`.
 *
 * @param tree - A (possibly nested) token object, e.g. `semanticTokens.light.color`.
 * @param prefix - Path segments accumulated so far — pass e.g. `['color']` to prefix every emitted name, or leave empty for none.
 * @returns A flat array of CSS custom property name/value tuples.
 *
 * @example
 * ```ts
 * flatten({ base: { 100: '#fff' } }, ['color']);
 * // [['--color-base-100', '#fff']]
 * ```
 */
function flatten(tree: TokenTree, prefix: string[] = []): [string, string][] {
  const entries: [string, string][] = [];
  for (const [key, value] of Object.entries(tree)) {
    const path = [...prefix, toKebabCase(key)];
    if (typeof value === 'string') {
      entries.push([`--${path.join('-')}`, value]);
    } else {
      entries.push(...flatten(value, path));
    }
  }
  return entries;
}

/**
 * Renders a list of declaration entries as a single CSS rule block. Entries
 * aren't required to be custom properties — a `['color-scheme', 'light']`
 * pair renders as the literal `color-scheme: light;` declaration, which is
 * how the native (non-`--`) `color-scheme` property gets into these blocks
 * alongside the flattened `--color-*` custom properties.
 *
 * @param selector - The CSS selector, e.g. `':root'` or `'.dark'`. May itself contain a comma + newline for a multi-selector rule.
 * @param entries - `[name, value]` pairs, from {@link flatten} or added directly.
 * @param indent - Leading whitespace prefixed to every line (for nesting inside `@media`).
 * @returns The rendered CSS block as a string.
 *
 * @example
 * ```ts
 * toCssBlock(':root', [['color-scheme', 'light'], ['--color-primary', 'oklch(76% 0.188 70.08)']]);
 * // ':root {\n  color-scheme: light;\n  --color-primary: oklch(76% 0.188 70.08);\n}'
 * ```
 */
function toCssBlock(selector: string, entries: [string, string][], indent = ''): string {
  const lines = entries.map(([name, value]) => `${indent}  ${name}: ${value};`).join('\n');
  return `${indent}${selector} {\n${lines}\n${indent}}`;
}

const lightEntries: [string, string][] = [
  ['color-scheme', semanticTokens.light.colorScheme],
  ...flatten(semanticTokens.light.color, ['color']),
];
const darkEntries: [string, string][] = [
  ['color-scheme', semanticTokens.dark.colorScheme],
  ...flatten(semanticTokens.dark.color, ['color']),
];
const componentEntries = flatten(componentTokens);

// Theme-independent "shape" tokens — emitted once in `:root`, never
// duplicated into `.dark`/`[data-theme="dark"]`, since none of these vary
// by color scheme.
const radiusEntries = flatten(primitiveTokens.radius, ['radius']);
const sizeEntries = flatten(primitiveTokens.size, ['size']);
const fontEntries = flatten(primitiveTokens.fontStack, ['font']);
const effectEntries = flatten(primitiveTokens.effect);

const css = `/**
 * GENERATED FILE — do not hand-edit.
 * Source: packages/react-ui/src/tokens/{primitive,semantic,component}.ts
 * Regenerate: pnpm --filter @nebula/react-ui generate-tokens
 */

${toCssBlock(':root', [...lightEntries, ...componentEntries, ...radiusEntries, ...sizeEntries, ...fontEntries, ...effectEntries])}

/* \`.dark\` is the primary selector (matches Tailwind's default \`dark:\`
   class strategy and this theme's DaisyUI origin); \`[data-theme="dark"]\`
   is kept alongside it since ThemeProvider sets that attribute too and some
   consumers may already have written overrides against it. */
${toCssBlock('.dark,\n[data-theme="dark"]', darkEntries)}

/* Only applies when the consumer hasn't set data-theme (or set it to
   "system") and hasn't added the .dark class — see ThemeProvider, which sets
   both explicitly once the user's preference is known, avoiding a hydration
   flash. */
@media (prefers-color-scheme: dark) {
${toCssBlock('[data-theme="system"]', darkEntries, '  ')}
}
`;

const outPath = new URL('../theme.css', import.meta.url);
writeFileSync(outPath, css, 'utf8');


console.log(
  `Wrote ${lightEntries.length + darkEntries.length + componentEntries.length + radiusEntries.length + sizeEntries.length + fontEntries.length + effectEntries.length} tokens to ${outPath.pathname}`,
);
