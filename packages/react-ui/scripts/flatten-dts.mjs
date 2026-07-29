#!/usr/bin/env node
// `tsc -p tsconfig.build.json --emitDeclarationOnly` mirrors `src/`'s
// category subfolders (`src/typography/label/` etc — see AGENTS.md /
// ARCHITECTURE.md §D) 1:1 into `dist/`, since tsc has no
// concept of tsup's flat per-entry output keys. tsup's own JS output stays
// flat (`dist/label/index.js`) because its `entry` map's KEY controls the
// output path regardless of the source VALUE's folder depth — but nothing
// gives tsc that same remapping, so left alone its declarations end up at
// `dist/typography/label/index.d.ts` while `package.json`'s `exports` map
// (and every consumer's `@nebula-lab/react-ui/label` import) expects
// `dist/label/index.d.ts`. This script closes that gap: it rewrites any
// relative type-only reference that crosses a category boundary, then
// moves each category folder's contents up into the already-flat JS
// output directory tsup created, and removes the emptied category dirs.
//
// dts generation can't just move to tsup's own `dts: true` instead (which
// *would* output flat, entry-keyed declarations directly) — see this
// package's `tsup.config.ts` comment: with 100+ entries all referencing
// the recursive `PolymorphicComponentPropsWithRef<E>` generic, tsup's dts
// worker (rollup-plugin-dts) reliably OOMs (unresolved upstream issue,
// https://github.com/egoist/tsup/issues/920), which is why this package
// uses plain `tsc` for declarations at all.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// Any top-level `dist/` dir that isn't itself a flat public entry is a
// category folder from `src/`'s layout — keep in sync with the category
// list in `ARCHITECTURE.md` §2 / `AGENTS.md`'s status
// table if a new one is ever added.
const CATEGORY_DIRS = [
  'layout',
  'typography',
  'media',
  'actions',
  'forms',
  'data-display',
  'feedback',
  'overlays',
  'navigation',
  'drag-and-drop',
  'theming',
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const categoryDirsPresent = CATEGORY_DIRS.filter((c) => fs.existsSync(path.join(DIST, c)));
if (categoryDirsPresent.length === 0) {
  console.log('flatten-dts: no nested category dirs found under dist/, nothing to do');
  process.exit(0);
}

// A component's new flat location is `dist/<name>/...` — the same `name`
// tsup already used as its own entry key, i.e. the immediate parent
// directory of each file once you strip the category prefix.
function newLocationFor(fileAbs) {
  const rel = path.relative(DIST, fileAbs); // e.g. typography/label/label.d.ts
  const parts = rel.split(path.sep);
  const [category, name, ...rest] = parts;
  if (!CATEGORY_DIRS.includes(category)) return fileAbs; // not under a category dir
  return path.join(DIST, name, ...rest);
}

// 1. Rewrite relative type-only imports/exports in every .d.ts (not
// .d.ts.map — those are JSON source maps, not resolved at typecheck time)
// while files are still at their nested location, since the rewrite needs
// to resolve each specifier against the file's *current* path.
const importRe = /((?:im|ex)port(?:\s+type)?\s*(?:\(|.*?from\s+))(['"])(\.\.?\/[^'"]+)\2/g;
let rewrittenFiles = 0;
for (const category of categoryDirsPresent) {
  for (const file of walk(path.join(DIST, category))) {
    if (!file.endsWith('.d.ts')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const newFileAbs = newLocationFor(file);
    let changed = false;
    const next = content.replace(importRe, (whole, prefix, quote, spec) => {
      const oldTargetAbs = path.resolve(path.dirname(file), spec);
      const newTargetAbs = newLocationFor(oldTargetAbs);
      let newSpec = path.relative(path.dirname(newFileAbs), newTargetAbs).split(path.sep).join('/');
      if (!newSpec.startsWith('.')) newSpec = './' + newSpec;
      if (newSpec === spec) return whole;
      changed = true;
      return `${prefix}${quote}${newSpec}${quote}`;
    });
    if (changed) {
      fs.writeFileSync(file, next);
      rewrittenFiles++;
    }
  }
}
console.log(`flatten-dts: rewrote relative type references in ${rewrittenFiles} .d.ts files`);

// 2. Move each category dir's per-component subfolder contents up into
// the flat `dist/<name>/` directory tsup's JS build already created
// (merging — the .d.ts/.d.ts.map files join the existing .js/.js.map).
let movedDirs = 0;
for (const category of categoryDirsPresent) {
  const categoryDir = path.join(DIST, category);
  for (const name of fs.readdirSync(categoryDir)) {
    const from = path.join(categoryDir, name);
    const to = path.join(DIST, name);
    fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      fs.renameSync(path.join(from, file), path.join(to, file));
    }
    fs.rmdirSync(from);
    movedDirs++;
  }
  fs.rmdirSync(categoryDir);
}
console.log(`flatten-dts: flattened ${movedDirs} component declaration dirs`);
