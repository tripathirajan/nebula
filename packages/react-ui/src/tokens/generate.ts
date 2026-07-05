/**
 * Regenerates `theme.css` from `semantic.ts` + `component.ts`.
 *
 * Run with: `pnpm --filter @nebula/react-ui generate-tokens`
 * (or `npx tsx packages/react-ui/src/tokens/generate.ts` from the repo root,
 * per component-library-architecture.md §7).
 *
 * `primitive.ts` is intentionally not walked here — it only exists to be
 * referenced *by* `semantic.ts`; emitting it as CSS vars too would let
 * components bypass the semantic layer and defeat the point of theming.
 *
 * @example
 * ```sh
 * pnpm --filter @nebula/react-ui generate-tokens
 * # -> Wrote 42 tokens to .../packages/react-ui/src/theme.css
 * ```
 */
import { writeFileSync } from 'node:fs';

import { componentTokens } from './component';
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
 * toKebabCase('interactiveHover'); // 'interactive-hover'
 * ```
 */
function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Recursively walks a nested token tree into a flat list of
 * `[--custom-property-name, value]` pairs, joining nested keys with `-`.
 *
 * @param tree - A (possibly nested) token object, e.g. `semanticTokens.light`.
 * @param prefix - Path segments accumulated so far (used internally for recursion).
 * @returns A flat array of CSS custom property name/value tuples.
 *
 * @example
 * ```ts
 * flatten({ color: { bg: { default: '#fff' } } });
 * // [['--color-bg-default', '#fff']]
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
 * Renders a list of custom-property entries as a single CSS rule block.
 *
 * @param selector - The CSS selector, e.g. `':root'` or `'[data-theme="dark"]'`.
 * @param entries - `[name, value]` pairs as produced by {@link flatten}.
 * @param indent - Leading whitespace prefixed to every line (for nesting inside `@media`).
 * @returns The rendered CSS block as a string.
 *
 * @example
 * ```ts
 * toCssBlock(':root', [['--color-bg-default', '#fff']]);
 * // ':root {\n  --color-bg-default: #fff;\n}'
 * ```
 */
function toCssBlock(selector: string, entries: [string, string][], indent = ''): string {
  const lines = entries.map(([name, value]) => `${indent}  ${name}: ${value};`).join('\n');
  return `${indent}${selector} {\n${lines}\n${indent}}`;
}

const lightEntries = flatten(semanticTokens.light);
const darkEntries = flatten(semanticTokens.dark);
const componentEntries = flatten(componentTokens);

const css = `/**
 * GENERATED FILE — do not hand-edit.
 * Source: packages/react-ui/src/tokens/{semantic,component}.ts
 * Regenerate: pnpm --filter @nebula/react-ui generate-tokens
 */

${toCssBlock(':root', [...lightEntries, ...componentEntries])}

${toCssBlock('[data-theme="dark"]', darkEntries)}

/* Only applies when the consumer hasn't set data-theme (or set it to
   "system") — see ThemeProvider, which sets data-theme explicitly once the
   user's preference is known, avoiding a hydration flash. */
@media (prefers-color-scheme: dark) {
${toCssBlock('[data-theme="system"]', darkEntries, '  ')}
}
`;

const outPath = new URL('../theme.css', import.meta.url);
writeFileSync(outPath, css, 'utf8');

 
console.log(`Wrote ${lightEntries.length + darkEntries.length + componentEntries.length} tokens to ${outPath.pathname}`);
