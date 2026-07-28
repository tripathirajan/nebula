#!/usr/bin/env node
// `tsc -p tsconfig.build.json --emitDeclarationOnly` mirrors src/'s family
// groupings (e.g. `src/flex/{flex,stack,hstack,...}/`) 1:1 into dist/, but
// tsup's JS output stays flat (`dist/stack/index.js`) since its `entry`
// map's key controls the output path regardless of source depth. Left
// alone, every grouped component's `.d.ts` ends up at a path package.json's
// `exports` map doesn't point at. Same problem/fix as
// `packages/react-ui/scripts/flatten-dts.mjs`, adapted for the case where
// the family folder name is *also* one of its own members' names (e.g.
// `flex/flex/`, not just `flex/stack/`) — that member needs its dist
// output merged into the family folder's own flat location, not moved out
// of it, so it needs the reverse of what every other member needs.
//
// Usage: node scripts/flatten-family-dts.mjs <familyName> <rootMemberName> <otherMember1> <otherMember2> ...
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const [, , familyName, rootMember, ...otherMembers] = process.argv;
if (!familyName || !rootMember) {
  console.error('Usage: node flatten-family-dts.mjs <familyName> <rootMemberName> <otherMember1> ...');
  process.exit(1);
}

const familyDir = path.join(DIST, familyName);
if (!fs.existsSync(familyDir)) {
  console.log(`flatten-family-dts: ${familyName}/ not found in dist/, nothing to do`);
  process.exit(0);
}

function moveContents(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    fs.renameSync(path.join(from, file), path.join(to, file));
  }
  fs.rmdirSync(from);
}

// Root member: its dist output needs to end up at dist/<familyName>/ itself
// (merging with the flat .js files tsup already put there) -- go via a temp
// dir since the destination is currently occupied by the family folder.
const rootFrom = path.join(familyDir, rootMember);
if (fs.existsSync(rootFrom)) {
  const tmp = path.join(DIST, `__tmp_${rootMember}__`);
  moveContents(rootFrom, tmp);
  moveContents(tmp, familyDir);
  console.log(`  ${familyName}/${rootMember} -> ${familyName}/ (merged into family folder's own flat output)`);
}

// Every other member: straightforward move up to its own already-flat dir.
for (const member of otherMembers) {
  const from = path.join(familyDir, member);
  if (!fs.existsSync(from)) continue;
  const to = path.join(DIST, member);
  moveContents(from, to);
  console.log(`  ${familyName}/${member} -> ${member}/`);
}
