#!/usr/bin/env node
// Regenerates COMPONENT_INVENTORY.md from the actual source tree — walks
// each package's src/, pulls each component's real exported name and the
// first sentence of its own doc comment, and cross-references which layer
// extends/wraps which (via real import statements and folder-name
// matching, not a hand-maintained list). Run after adding, renaming, or
// moving a component so the doc doesn't drift from the code.
//
// Usage: node scripts/generate-component-inventory.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG_ROOT = path.join(REPO_ROOT, 'packages');

const PACKAGES = {
  primitives: { dir: path.join(PKG_ROOT, 'primitives/src'), depth: 1 },
  headless: { dir: path.join(PKG_ROOT, 'headless/src'), depth: 1 },
  styleless: { dir: path.join(PKG_ROOT, 'styleless/src'), depth: 1 },
  'react-ui': { dir: path.join(PKG_ROOT, 'react-ui/src'), depth: 2 }, // category/component
  'react-ui-blocks': { dir: path.join(PKG_ROOT, 'react-ui-blocks/src'), depth: 2 }, // handled specially below
};

// Known renames across layers (styleless's "-input" naming becomes
// react-ui's "-field" naming for the same component).
const ALIASES = {
  'email-input': 'email-field',
  'password-input': 'password-field',
  'search-input': 'search-field',
  'tel-input': 'tel-field',
  'url-input': 'url-field',
};
const REVERSE_ALIASES = Object.fromEntries(Object.entries(ALIASES).map(([k, v]) => [v, k]));

// Internal utility/building-block modules in primitives -- real, but not
// meant to be used as a standalone rendered component the way Button/Card
// are. Keep in sync if primitives gains new non-component infra folders.
const PRIMITIVE_INTERNAL_UTILITIES = new Set([
  'boundary', 'cn', 'compose-event-handlers', 'compose-refs', 'create-context-scope',
  'dismissible-layer', 'focus-scope', 'overlay', 'popper', 'portal', 'presence',
  'primitive', 'roving-focus-group', 'slot', 'types', 'visually-hidden',
]);

// ---------- doc-comment / name extraction ----------

function firstSentence(text) {
  const cleaned = text
    .split('\n')
    .map((l) => l.replace(/^\s*\*\/?/, '').trim())
    .filter((l) => !l.startsWith('@'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const m = cleaned.match(/^(.*?[.!?])(\s|$)/);
  return (m ? m[1] : cleaned).slice(0, 220);
}

function pascalFallback(kebab) {
  return kebab.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

function extractDocSummary(fileContent, componentName) {
  const pascal = pascalFallback(componentName);
  const declRe = new RegExp(`(?:function|const)\\s+${pascal}\\b`);
  const declMatch = fileContent.match(declRe);
  const blocks = [...fileContent.matchAll(/\/\*\*([\s\S]*?)\*\//g)];
  if (blocks.length > 0) {
    if (declMatch) {
      let best = null;
      for (const b of blocks) {
        if (b.index < declMatch.index) best = b;
        else break;
      }
      if (best) return firstSentence(best[1]);
    }
    let best = blocks[0];
    for (const b of blocks) if (b[1].length > best[1].length) best = b;
    return firstSentence(best[1]);
  }
  // No /** */ block -- some thin renamed-re-export files (e.g. `export
  // { Menu as ContextMenu } from '../menu/menu'`) explain themselves via a
  // leading run of `//` line comments instead. Use that if present.
  const lines = fileContent.split('\n');
  const leading = [];
  for (const line of lines) {
    const m = line.match(/^\/\/\s?(.*)$/);
    if (m) leading.push(m[1]);
    else if (leading.length > 0) break;
    else if (line.trim() === '') continue;
    else break;
  }
  return leading.length ? firstSentence(leading.join(' ')) : '';
}

function realExportName(filePath, fallback) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, 'utf8');
  // `export { Menu as ContextMenu }` -- a component built by re-exporting
  // another under a new public name (ContextMenu/DropdownMenu on top of
  // Menu, TreeView on top of Tree, Autocomplete on top of Combobox) should
  // show its own public name, not the thing it's aliased from.
  const aliasMatch = content.match(/export \{\s*[A-Za-z][A-Za-z0-9]*\s+as\s+([A-Za-z][A-Za-z0-9]*)/);
  if (aliasMatch) return aliasMatch[1];
  const m = content.match(/export \{\s*([A-Za-z][A-Za-z0-9]*)/);
  return m ? m[1] : fallback;
}

function findMainFile(folder, name, depth = 0) {
  if (depth > 4) return '';
  const candidates = [`${name}.tsx`, `${name}.ts`, 'index.ts'];
  for (const c of candidates) {
    const p = path.join(folder, c);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      const content = fs.readFileSync(p, 'utf8');
      if (c === 'index.ts' && !/\/\*\*/.test(content)) {
        const m = content.match(/from '\.\/([a-z0-9-]+)'/);
        if (m && m[1] !== name) return findMainFile(folder, m[1], depth + 1);
      }
      return content;
    }
  }
  const files = fs.readdirSync(folder).filter((f) => /\.(tsx|ts)$/.test(f) && !/\.(test|stories)\./.test(f));
  if (files.length > 0) return fs.readFileSync(path.join(folder, files[0]), 'utf8');
  return '';
}

function mainFilePath(pkgDir, category, name, isBlocks = false) {
  if (isBlocks) return path.join(pkgDir, category, `${name}.tsx`);
  const folder = category ? path.join(pkgDir, category, name) : path.join(pkgDir, name);
  const direct = path.join(folder, `${name}.tsx`);
  if (fs.existsSync(direct)) return direct;
  return path.join(folder, `${name}.ts`);
}

// ---------- walk each package for its component list ----------

function listComponents(pkgDir, depth) {
  const results = [];
  function walk(dir, relParts) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const parts = [...relParts, e.name];
      const hasFiles = fs.readdirSync(full).some((f) => /\.(tsx|ts)$/.test(f));
      if (hasFiles) {
        const content = findMainFile(full, e.name);
        results.push({
          name: e.name,
          category: relParts.join('/'),
          summary: extractDocSummary(content, e.name) || '(no doc comment found)',
        });
      } else if (parts.length < depth + 1) {
        walk(full, parts);
      }
    }
  }
  walk(pkgDir, []);
  return results;
}

const extracted = {};
for (const [pkg, { dir, depth }] of Object.entries(PACKAGES)) {
  if (pkg === 'react-ui-blocks') continue; // different, multi-component-per-folder convention -- handled below
  extracted[pkg] = listComponents(dir, depth).sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
}

// react-ui-blocks: a leaf folder can hold several *independent* sibling
// components (e.g. dashboard/billing/ has balance-card.tsx,
// billing-summary-card.tsx, plan-cards.tsx as three separate components,
// not sub-parts of one) -- so treat each real component .tsx file as its
// own row, not each folder.
const blocksDir = PACKAGES['react-ui-blocks'].dir;
const blocksFiles = [];
(function walkFiles(dir, relParts) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'compositions') continue; // full-page demo stories, not components
      walkFiles(full, [...relParts, e.name]);
    } else if (/\.tsx$/.test(e.name) && !/\.(test|stories)\.tsx$/.test(e.name)) {
      blocksFiles.push({ full, name: e.name.replace(/\.tsx$/, ''), category: relParts.join('/') });
    }
  }
})(blocksDir, []);
extracted['react-ui-blocks'] = blocksFiles
  .map(({ full, name, category }) => ({
    name,
    category,
    summary: extractDocSummary(fs.readFileSync(full, 'utf8'), name) || '(no doc comment found)',
  }))
  .sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));

// ---------- cross-reference which layer extends/wraps which ----------

const primNames = new Set(extracted.primitives.map((c) => c.name));
const headNames = new Set(extracted.headless.map((c) => c.name));
const styleNames = new Set(extracted.styleless.map((c) => c.name));
const uiNames = new Set(extracted['react-ui'].map((c) => c.name));

function resolveName(name, targetSet) {
  if (targetSet.has(name)) return name;
  if (ALIASES[name] && targetSet.has(ALIASES[name])) return ALIASES[name];
  if (REVERSE_ALIASES[name] && targetSet.has(REVERSE_ALIASES[name])) return REVERSE_ALIASES[name];
  return null;
}

function extendedBy(name, { checkHeadless, checkStyleless, checkUi }) {
  const hits = [];
  if (checkHeadless && resolveName(name, headNames)) hits.push('headless');
  if (checkStyleless && resolveName(name, styleNames)) hits.push('styleless');
  if (checkUi && resolveName(name, uiNames)) hits.push(`react-ui/${resolveName(name, uiNames)}`);
  return hits;
}

function grepBuiltOn(filePath, pkgPattern) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`from '${pkgPattern}/([a-z0-9-]+)'`, 'g');
  const found = new Set();
  for (const m of content.matchAll(re)) found.add(m[1]);
  return [...found];
}

const rows = {};

rows.primitives = extracted.primitives.map((c) => {
  const isUtility = PRIMITIVE_INTERNAL_UTILITIES.has(c.name);
  const ext = extendedBy(c.name, { checkHeadless: true, checkStyleless: true, checkUi: true });
  const file = mainFilePath(PACKAGES.primitives.dir, '', c.name);
  return {
    name: c.name,
    displayName: realExportName(file, pascalFallback(c.name)),
    summary: c.summary,
    notes: isUtility
      ? 'Internal building block, not a standalone rendered component.'
      : ext.length === 0
        ? '**Gap** — no styleless/headless/react-ui wrapper exists yet.'
        : '',
    extended: ext.length ? ext.join(', ') : '—',
  };
});

rows.headless = extracted.headless.map((c) => {
  const ext = extendedBy(c.name, { checkHeadless: false, checkStyleless: false, checkUi: true });
  const file = mainFilePath(PACKAGES.headless.dir, '', c.name);
  return {
    name: c.name,
    displayName: realExportName(file, pascalFallback(c.name)),
    summary: c.summary,
    notes:
      c.name === 'listbox'
        ? 'Internal engine for Select/Combobox/Autocomplete — not meant to be styled standalone.'
        : ext.length === 0
          ? '**Gap** — no react-ui wrapper exists yet.'
          : '',
    extended: ext.length ? ext.join(', ') : '—',
  };
});

rows.styleless = extracted.styleless.map((c) => {
  const ext = extendedBy(c.name, { checkHeadless: false, checkStyleless: false, checkUi: true });
  const alias = ALIASES[c.name];
  const file = mainFilePath(PACKAGES.styleless.dir, '', c.name);
  return {
    name: c.name,
    displayName: realExportName(file, pascalFallback(c.name)),
    summary: c.summary,
    notes: alias
      ? `Exposed in react-ui as \`${alias}\`.`
      : ext.length === 0
        ? '**Gap** — no react-ui wrapper exists yet.'
        : '',
    extended: ext.length ? ext.join(', ') : '—',
  };
});

rows['react-ui'] = extracted['react-ui'].map((c) => {
  const file = mainFilePath(PACKAGES['react-ui'].dir, c.category, c.name);
  const builtOnPrim = grepBuiltOn(file, '@nebula-lab/primitives');
  const builtOnHead = grepBuiltOn(file, '@nebula-lab/headless');
  const builtOnStyle = grepBuiltOn(file, '@nebula-lab/styleless');
  const parts = [];
  if (builtOnPrim.length) parts.push(`primitives/${builtOnPrim.join(',')}`);
  if (builtOnHead.length) parts.push(`headless/${builtOnHead.join(',')}`);
  if (builtOnStyle.length) parts.push(`styleless/${builtOnStyle.join(',')}`);
  return {
    name: c.name,
    displayName: realExportName(file, pascalFallback(c.name)),
    category: c.category,
    summary: c.summary,
    notes: '',
    builtOn: parts.length ? parts.join('; ') : '(composed from other react-ui atoms)',
  };
});

rows['react-ui-blocks'] = extracted['react-ui-blocks'].map((c) => {
  const file = mainFilePath(PACKAGES['react-ui-blocks'].dir, c.category, c.name, true);
  const builtOnUi = grepBuiltOn(file, '@nebula-lab/react-ui');
  return {
    name: c.name,
    displayName: realExportName(file, pascalFallback(c.name)),
    category: c.category,
    summary: c.summary,
    notes: '',
    builtOn: builtOnUi.length ? `react-ui/${builtOnUi.join(', react-ui/')}` : '(composed from other blocks/primitives directly)',
  };
});

// ---------- render markdown ----------

function esc(s) {
  return (s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function maybeEllipsis(s) {
  if (!s) return s;
  return s.length >= 218 ? s.replace(/[.,;:\s]*$/, '') + '…' : s;
}

function tableSection(title, description, list, columns) {
  let out = `## ${title}\n\n${description}\n\n`;
  out += `| SN | Component | ${columns.header} | Usage | Notes |\n`;
  out += `|---|---|---|---|---|\n`;
  list.forEach((r, i) => {
    out += `| ${i + 1} | \`${r.displayName}\` | ${esc(columns.value(r))} | ${esc(maybeEllipsis(r.summary))} | ${esc(r.notes)} |\n`;
  });
  return out + '\n';
}

const totals = Object.entries(rows).map(([k, v]) => `${k} ${v.length}`).join(' · ');
const grandTotal = Object.values(rows).reduce((sum, v) => sum + v.length, 0);

let doc = `# Nebula Component Inventory

One table per package — every component/primitive currently in the monorepo, what it does, and how it relates to the layer above/below it (per \`component-library-architecture.md\`'s layering: \`primitives\` → \`headless\` → \`styleless\` → \`react-ui\` → \`react-ui-blocks\`).

Generated by walking each package's \`src/\` tree and each component's own doc comment — regenerate with \`node scripts/generate-component-inventory.mjs\` after adding/moving components rather than hand-editing this file, so it doesn't drift.

**Totals**: ${totals} — **${grandTotal} components** across 5 packages.

---

`;

doc += tableSection(
  '`@nebula-lab/primitives`',
  'The foundation layer — unstyled, polymorphic, behavior-only building blocks (focus management, positioning, portals, ref/handler composition) plus a handful of genuinely standalone atoms (`Box`, `Button`, `Input`, `Text`, ...). Everything else in the monorepo is built on top of this layer.',
  rows.primitives,
  { header: 'Extended By (styleless / headless / react-ui)', value: (r) => r.extended },
);

doc += tableSection(
  '`@nebula-lab/headless`',
  'Behavior + ARIA-correct state machines with zero styling — the "logic" half of interactive components (`Dialog`, `Select`, `Accordion`, ...). `react-ui` wraps almost all of these directly with Tailwind classes.',
  rows.headless,
  { header: 'Extended By (react-ui)', value: (r) => r.extended },
);

doc += tableSection(
  '`@nebula-lab/styleless`',
  "A thinner, in-between layer: real behavior extracted out of specific `react-ui` components (so the logic isn't locked inside one styled implementation), still with no Tailwind classes of its own — every part takes a `classNames` prop that `react-ui`'s version supplies.",
  rows.styleless,
  { header: 'Extended By (react-ui)', value: (r) => r.extended },
);

doc += tableSection(
  '`@nebula-lab/react-ui`',
  'The styled, themeable component library — Tailwind classes + this package\'s own design tokens (`theme.css`) applied over `headless`/`styleless`/`primitives`. Organized into category subfolders (`actions`, `data-display`, `forms`, `layout`, `media`, `navigation`, `overlays`, `theming`, `typography`, `feedback`, `drag-and-drop`) — every component still ships a flat `@nebula-lab/react-ui/<name>` import path regardless of its `src/` folder depth.',
  rows['react-ui'],
  { header: 'Built On', value: (r) => r.builtOn },
);

doc += tableSection(
  '`@nebula-lab/react-ui-blocks`',
  "Organisms — full page sections/flows (`LoginForm`, `SaasAppHeader`, `ChatWindow`, ...) composed from `react-ui` components, each shaped by one specific flow's copy/logic rather than being domain-neutral. Exported per domain category (`authentication`, `dashboard`, `ecommerce`, ...), not per-component.",
  rows['react-ui-blocks'],
  { header: 'Built On (react-ui)', value: (r) => r.builtOn },
);

const primitiveGaps = rows.primitives.filter((r) => r.notes.startsWith('**Gap**'));
const headlessGaps = rows.headless.filter((r) => r.notes.startsWith('**Gap**'));
const styleGaps = rows.styleless.filter((r) => r.notes.startsWith('**Gap**'));

doc += `---

## Known gaps (computed from this table, not hand-listed)

${
  primitiveGaps.length === 0 && headlessGaps.length === 0 && styleGaps.length === 0
    ? '_None right now — every non-internal-utility component in `primitives`/`headless`/`styleless` has a `react-ui` wrapper._'
    : [
        primitiveGaps.length
          ? `- **\`primitives\`**: ${primitiveGaps.map((r) => `\`${r.displayName}\``).join(', ')} — no \`react-ui\` wrapper yet.`
          : null,
        headlessGaps.length
          ? `- **\`headless\`**: ${headlessGaps.map((r) => `\`${r.displayName}\``).join(', ')} — no \`react-ui\` wrapper yet.`
          : null,
        styleGaps.length
          ? `- **\`styleless\`**: ${styleGaps.map((r) => `\`${r.displayName}\``).join(', ')} — no \`react-ui\` wrapper yet.`
          : null,
      ]
        .filter(Boolean)
        .join('\n')
}
- **\`headless/listbox\`**: deliberately has no \`react-ui\` wrapper — it's \`Select\`/\`Combobox\`/\`Autocomplete\`'s shared internal engine, not meant to be styled standalone.
- **Renames across layers**: \`styleless\`'s \`email-input\`/\`password-input\`/\`search-input\`/\`tel-input\`/\`url-input\` are exposed in \`react-ui\` as \`email-field\`/\`password-field\`/\`search-field\`/\`tel-field\`/\`url-field\` — same component, different public name.

## Keeping this doc current

This file is generated, not hand-maintained — each component's **Usage** cell is the first sentence of that component's own doc comment (JSDoc directly above its \`function X\`/\`const X\` declaration), and **Built On**/**Extended By** are computed from real \`import\` statements and folder-name matches, not guessed. Re-run \`node scripts/generate-component-inventory.mjs\` after any component is added, renamed, or moved between packages so the totals/gaps above stay accurate — don't hand-edit rows here, fix the source doc comment instead and regenerate.
`;

fs.writeFileSync(path.join(REPO_ROOT, 'COMPONENT_INVENTORY.md'), doc);
console.log(`COMPONENT_INVENTORY.md written — ${grandTotal} components across ${Object.keys(rows).length} packages.`);
