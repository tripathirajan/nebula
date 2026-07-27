#!/usr/bin/env node
/**
 * Generates each released project's own changelog + git tag, then makes
 * one combined commit for all of them.
 *
 * `nx release changelog` requires an explicit target `[version]` positional
 * when invoked directly (outside the full `nx release` orchestrator) — see
 * `publish.yml`'s own history: the original invocation omitted it and
 * failed with "An explicit target version must be specified", because in
 * `nx.json`'s `independent` projects-relationship mode there's no single
 * shared version to infer it from (each released project may be at a
 * different version). This script supplies each project's own version,
 * read straight off its just-bumped `package.json`, one `nx release
 * changelog` call per project — staging + tagging each one but not
 * committing yet (`--git-commit=false`), then committing everything
 * together at the end so the release still lands as one commit (matching
 * the original single-commit intent), not one commit per package.
 *
 * Usage: node generate-changelogs.mjs <project1,project2,...>
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const projectsArg = process.argv[2];
if (!projectsArg) {
  console.error('Usage: generate-changelogs.mjs <project1,project2,...>');
  process.exit(1);
}
const targetProjects = projectsArg.split(',').filter(Boolean);

const packagesDir = 'packages';
const packageDirs = readdirSync(packagesDir).filter((dir) =>
  existsSync(join(packagesDir, dir, 'package.json')),
);

for (const dir of packageDirs) {
  const pkgJsonPath = join(packagesDir, dir, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  if (!targetProjects.includes(pkgJson.name)) continue;

  console.log(`\n--- Changelog for ${pkgJson.name}@${pkgJson.version} ---`);
  execFileSync(
    'pnpm',
    [
      'nx',
      'release',
      'changelog',
      pkgJson.version,
      `--projects=${pkgJson.name}`,
      '--git-tag=true',
      '--git-commit=false',
      '--stage-changes=true',
    ],
    { stdio: 'inherit' },
  );
}

console.log('\n--- Committing all changelogs together ---');
execFileSync('git', ['commit', '-m', `chore(release): publish ${targetProjects.join(', ')}`], {
  stdio: 'inherit',
});
