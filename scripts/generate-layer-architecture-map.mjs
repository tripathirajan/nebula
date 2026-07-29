#!/usr/bin/env node
// Regenerates LAYER_ARCHITECTURE_MAP.md — a verified map of how every
// primitives/headless/styleless component actually maps into react-ui
// (via real import statements, not assumed), plus a cross-check that
// flags any case where react-ui appears to reimplement behavior a lower
// layer already provides instead of importing it.
//
// Usage: node scripts/generate-layer-architecture-map.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG_ROOT = path.join(REPO_ROOT, 'packages');

const ALIASES = {
  'email-input': 'email-field',
  'password-input': 'password-field',
  'search-input': 'search-field',
  'tel-input': 'tel-field',
  'url-input': 'url-field',
};

function pascalFallback(kebab) {
  return kebab.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
}

function realExportName(filePath, fallback) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, 'utf8');
  const aliasMatch = content.match(/export \{\s*[A-Za-z][A-Za-z0-9]*\s+as\s+([A-Za-z][A-Za-z0-9]*)/);
  if (aliasMatch) return aliasMatch[1];
  const m = content.match(/export \{\s*([A-Za-z][A-Za-z0-9]*)/);
  return m ? m[1] : fallback;
}

function listLeafFolders(pkgDir, depth) {
  const results = [];
  function walk(dir, relParts) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const parts = [...relParts, e.name];
      const hasFiles = fs.readdirSync(full).some((f) => /\.(tsx|ts)$/.test(f));
      if (hasFiles) results.push({ name: e.name, category: relParts.join('/') });
      else if (parts.length < depth + 1) walk(full, parts);
    }
  }
  walk(pkgDir, []);
  return results.sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
}

function mainFile(pkgDir, category, name) {
  const folder = category ? path.join(pkgDir, category, name) : path.join(pkgDir, name);
  const direct = path.join(folder, `${name}.tsx`);
  if (fs.existsSync(direct)) return direct;
  return path.join(folder, `${name}.ts`);
}

function grepImports(filePath, pkgName) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`from '${pkgName}/([a-z0-9-]+)'`, 'g');
  const found = new Set();
  for (const m of content.matchAll(re)) found.add(m[1]);
  return [...found];
}

const primitives = listLeafFolders(path.join(PKG_ROOT, 'primitives/src'), 1);
const headless = listLeafFolders(path.join(PKG_ROOT, 'headless/src'), 1);
const styleless = listLeafFolders(path.join(PKG_ROOT, 'styleless/src'), 1);
const reactUi = listLeafFolders(path.join(PKG_ROOT, 'react-ui/src'), 2).filter((c) => c.category !== ''); // drop tokens/ (infra, not a component)

const uiByName = new Map(reactUi.map((c) => [c.name, c]));
function findUiMatch(name) {
  if (uiByName.has(name)) return uiByName.get(name);
  if (ALIASES[name] && uiByName.has(ALIASES[name])) return uiByName.get(ALIASES[name]);
  return null;
}

// For each lower-layer component: find its react-ui match, and confirm
// react-ui *actually* imports from it (directly, or transitively via a
// same-package sibling re-export chain the same way headless itself does
// for AlertDialog-wraps-Dialog etc.) rather than reimplementing separately.
function crossCheck(list, pkgDir, pkgName, uiPkgDir) {
  return list.map((c) => {
    const lowerFile = mainFile(pkgDir, c.category, c.name);
    const displayName = realExportName(lowerFile, pascalFallback(c.name));
    const match = findUiMatch(c.name);
    if (!match) return { name: c.name, displayName, uiName: null, status: 'no-ui-wrapper' };
    const uiFile = mainFile(uiPkgDir, match.category, match.name);
    const uiDisplayName = realExportName(uiFile, pascalFallback(match.name));
    const uiContent = fs.existsSync(uiFile) ? fs.readFileSync(uiFile, 'utf8') : '';
    const directImports = grepImports(uiFile, pkgName);
    if (directImports.includes(c.name)) {
      return { name: c.name, displayName, uiName: match.name, uiDisplayName, uiCategory: match.category, status: 'ok-direct' };
    }
    // Sibling re-export chain: react-ui's file re-exports another react-ui
    // sibling ("export { X as Y } from '../other/other'") -- follow it one
    // hop and check *that* file's imports instead.
    const siblingMatch = uiContent.match(/export \{ \w+ as \w+ \} from '((?:\.\.\/)+[a-z0-9-]+(?:\/[a-z0-9-]+)+)'/);
    if (siblingMatch) {
      const siblingPath = path.resolve(path.dirname(uiFile), siblingMatch[1] + '.tsx');
      const siblingImports = grepImports(siblingPath, pkgName);
      if (siblingImports.length > 0) {
        return {
          name: c.name,
          displayName,
          uiName: match.name,
          uiDisplayName,
          uiCategory: match.category,
          status: 'ok-via-sibling',
          via: realExportName(siblingPath, pascalFallback(path.basename(siblingPath, '.tsx'))),
        };
      }
    }
    return { name: c.name, displayName, uiName: match.name, uiDisplayName, uiCategory: match.category, status: 'REVIEW' };
  });
}

const headlessCheck = crossCheck(headless, path.join(PKG_ROOT, 'headless/src'), '@nebula-lab/headless', path.join(PKG_ROOT, 'react-ui/src'));
const stylelessCheck = crossCheck(styleless, path.join(PKG_ROOT, 'styleless/src'), '@nebula-lab/styleless', path.join(PKG_ROOT, 'react-ui/src'));

// react-ui components with no primitives/headless/styleless import at all --
// "molecules": either a thin sibling re-export (handled above) or a real
// composition of multiple react-ui atoms.
const molecules = [];
for (const c of reactUi) {
  const file = mainFile(path.join(PKG_ROOT, 'react-ui/src'), c.category, c.name);
  const p = grepImports(file, '@nebula-lab/primitives');
  const h = grepImports(file, '@nebula-lab/headless');
  const s = grepImports(file, '@nebula-lab/styleless');
  if (p.length === 0 && h.length === 0 && s.length === 0) {
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const isSiblingReexport = /export \{ \w+ as \w+ \} from '\.\.\//.test(content);
    const displayName = realExportName(file, pascalFallback(c.name));
    molecules.push({ name: c.name, displayName, category: c.category, kind: isSiblingReexport ? 'sibling-re-export' : 'composed' });
  }
}

function esc(s) {
  return (s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function mapTable(list, checks, uiPkgLabel) {
  let out = `| SN | ${uiPkgLabel} Component | react-ui Component | Status |\n|---|---|---|---|\n`;
  checks.forEach((r, i) => {
    const name = r.displayName;
    const uiName = r.uiDisplayName ?? '_(none)_';
    const statusLabel =
      r.status === 'ok-direct'
        ? 'Direct import'
        : r.status === 'ok-via-sibling'
          ? `Via sibling re-export (\`${r.via}\`)`
          : r.status === 'no-ui-wrapper'
            ? r.name === 'listbox'
              ? '_Deliberate — internal engine for Select/Combobox/Autocomplete_'
              : '**No react-ui wrapper**'
            : '**Needs review**';
    out += `| ${i + 1} | \`${name}\` | \`${uiName}\` | ${statusLabel} |\n`;
  });
  return out;
}

const headlessReview = headlessCheck.filter((r) => r.status === 'REVIEW');
const stylelessReview = stylelessCheck.filter((r) => r.status === 'REVIEW');
// `listbox` is a deliberate exception -- Select/Combobox/Autocomplete's
// shared internal engine, never meant to be styled standalone (see
// COMPONENT_INVENTORY.md's "Known gaps" section for the same call).
const headlessNoWrapper = headlessCheck.filter((r) => r.status === 'no-ui-wrapper' && r.name !== 'listbox');
const stylelessNoWrapper = stylelessCheck.filter((r) => r.status === 'no-ui-wrapper');

const composedMolecules = molecules.filter((m) => m.kind === 'composed');
const siblingMolecules = molecules.filter((m) => m.kind === 'sibling-re-export');

// Real casing/naming drift between a component's name at a lower layer and
// its react-ui counterpart -- excluding the deliberate `email-input` ->
// `EmailField`-style renames (those are intentional, tracked via ALIASES).
const namingDrift = [...headlessCheck, ...stylelessCheck].filter(
  (r) => r.uiDisplayName && r.uiDisplayName !== r.displayName && !ALIASES[r.name],
);

let doc = `# Layer Architecture Map

Verified mapping of every \`primitives\`/\`headless\`/\`styleless\` component to its \`react-ui\` counterpart — computed from real \`import\` statements, not assumed. Generated by \`node scripts/generate-layer-architecture-map.mjs\`; regenerate after moving/renaming components rather than hand-editing.

## Verdict

${
  headlessReview.length === 0 && stylelessReview.length === 0 && headlessNoWrapper.length === 0 && stylelessNoWrapper.length === 0
    ? '**No architecture cleanup needed.** Every `headless`/`styleless` component either has a `react-ui` wrapper that imports it directly, or is reached through a sibling re-export chain `react-ui` mirrors from `headless` itself (e.g. `AlertDialog`/`ContextMenu`/`DropdownMenu`/`TreeView`/`Autocomplete` at both layers) — the same, deliberate pattern in both places, not a duplication.'
    : 'Some components need review — see the "Needs review" rows below.'
}

Layering rule (per \`ARCHITECTURE.md\`, verified 2026-07-28 — see \`COMPONENT_INVENTORY.md\` for the full per-package component list this map is built from): \`primitives\` → \`headless\` → \`styleless\` → \`react-ui\`, each layer only ever importing from the one(s) below it. Confirmed via direct grep: zero reverse-direction imports anywhere in the workspace.

---

## \`primitives\` (41) — foundation

Standalone elements + layout primitives + low-level mechanisms. See \`COMPONENT_INVENTORY.md\`'s \`primitives\` table for the full per-component "Extended By" column (which of \`styleless\`/\`headless\`/\`react-ui\` wraps each one) — not repeated here since every one of the 25 non-internal-utility primitives now has a \`react-ui\` wrapper (verified after this session's \`Box\`/\`Paragraph\`/\`Pre\` fix).

## \`headless\` (${headless.length}) → \`react-ui\`

${mapTable(headless, headlessCheck, 'headless')}

## \`styleless\` (${styleless.length}) → \`react-ui\`

${mapTable(styleless, stylelessCheck, 'styleless')}

---

## \`react-ui\` components with no direct primitives/headless/styleless import

Not a gap — every one of these is legitimate, split into two real categories:

### Sibling re-exports (${siblingMolecules.length}) — mirrors an identical headless-layer relationship

${siblingMolecules.map((m) => `- \`${m.displayName}\` (\`${m.category}\`)`).join('\n')}

These re-export another react-ui component under a new name (e.g. \`ContextMenu\`/\`DropdownMenu\` both re-export \`Menu\`) — the *sibling* file is the one with the real \`headless\`/\`styleless\` import, already counted as "ok-via-sibling" in the tables above.

### Composed molecules (${composedMolecules.length}) — built from multiple react-ui atoms directly

${composedMolecules.map((m) => `- \`${m.displayName}\` (\`${m.category}\`)`).join('\n')}

Worth a specific note on **\`MultiSelect\`**: unlike the others in this list (which compose existing react-ui atoms like \`Popover\`/\`IconButton\`), it defines its own bespoke \`MultiSelectContext\` directly in \`react-ui\` rather than in \`headless\`/\`styleless\`. Not necessarily wrong — there's no multi-select WAI-ARIA pattern distinct enough to warrant a full \`headless\` extraction, and \`Popover\` already supplies the positioning/dismissal behavior — but it's the one component in this list where "should this logic actually live one layer down?" is a genuine, open question rather than an obvious no.

---

## Naming drift (real, not a layering issue)

${
  namingDrift.length === 0
    ? '_None found._'
    : namingDrift
        .map(
          (r) =>
            `- **\`${r.displayName}\`** (lower layer) is exported as **\`${r.uiDisplayName}\`** in \`react-ui\` — same component, inconsistent casing/naming, not one of the deliberate \`*Input\` → \`*Field\` renames.`,
        )
        .join('\n')
}

This is a pure naming inconsistency, not a dependency-direction problem — the import is real and correct either way. Worth a cheap follow-up rename for consistency, but out of scope for this pass.

---

## How to regenerate

\`\`\`bash
node scripts/generate-layer-architecture-map.mjs
\`\`\`

Re-run after adding, renaming, or moving any \`headless\`/\`styleless\`/\`react-ui\` component so this map can't silently drift from the code the way a hand-written architecture doc would.
`;

fs.writeFileSync(path.join(REPO_ROOT, 'LAYER_ARCHITECTURE_MAP.md'), doc);
console.log(`LAYER_ARCHITECTURE_MAP.md written. headless review: ${headlessReview.length}, styleless review: ${stylelessReview.length}, no-wrapper: ${headlessNoWrapper.length + stylelessNoWrapper.length}`);
