#!/usr/bin/env node
// `tsc -p tsconfig.build.json --emitDeclarationOnly` mirrors src/'s family
// groupings (e.g. `src/menu/{menu,context-menu,dropdown-menu}/`) 1:1 into
// dist/, but tsup's JS output stays flat (`dist/context-menu/index.js`)
// since its `entry` map's key controls the output path regardless of
// source depth. Left alone, every grouped component's `.d.ts` ends up at a
// path package.json's `exports` map doesn't point at. Same problem/fix as
// `packages/react-ui/scripts/flatten-dts.mjs` and
// `packages/primitives/scripts/flatten-family-dts.mjs`; this version
// handles multiple families in one pass (headless has 4: menu, dialog,
// combobox, tree) and the same root-name-collision wrinkle each family
// has (e.g. `menu/menu/` needs merging into `menu/`'s own flat output,
// not just moved like every other member).
//
// Usage: node scripts/flatten-family-dts.mjs <family>:<root>,<other1>,<other2> ...
// e.g.:  node scripts/flatten-family-dts.mjs menu:menu,context-menu,dropdown-menu dialog:dialog,alert-dialog,drawer
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const specs = process.argv.slice(2);
if (specs.length === 0) {
  console.error('Usage: node flatten-family-dts.mjs <family>:<root>,<other1>,<other2> ...');
  process.exit(1);
}

function moveContents(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    fs.renameSync(path.join(from, file), path.join(to, file));
  }
  fs.rmdirSync(from);
}

for (const spec of specs) {
  const [familyName, membersRaw] = spec.split(':');
  const [rootMember, ...otherMembers] = membersRaw.split(',');
  const familyDir = path.join(DIST, familyName);
  if (!fs.existsSync(familyDir)) {
    console.log(`flatten-family-dts: ${familyName}/ not found in dist/, skipping`);
    continue;
  }

  const rootFrom = path.join(familyDir, rootMember);
  if (fs.existsSync(rootFrom)) {
    const tmp = path.join(DIST, `__tmp_${rootMember}__`);
    moveContents(rootFrom, tmp);
    moveContents(tmp, familyDir);
    console.log(`  ${familyName}/${rootMember} -> ${familyName}/ (merged into family folder's own flat output)`);
  }

  for (const member of otherMembers) {
    const from = path.join(familyDir, member);
    if (!fs.existsSync(from)) continue;
    const to = path.join(DIST, member);
    moveContents(from, to);
    console.log(`  ${familyName}/${member} -> ${member}/`);
  }
}
