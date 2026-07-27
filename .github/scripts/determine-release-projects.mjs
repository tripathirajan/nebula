#!/usr/bin/env node
/**
 * Computes which workspace packages actually need a new version this
 * release, instead of `nx release version <bump>` blindly bumping every
 * project in the release group (the behavior before this script existed —
 * see `publish.yml`'s own comment on why that shipped every package in
 * lockstep despite `nx.json` already being configured for independent
 * versioning).
 *
 * Two-step rule:
 *
 * 1. Direct changes — a package is included if `git diff` shows any file
 *    under its own `packages/<dir>/` changed since *that package's own*
 *    last release tag (`@<name>@<version>`, e.g. `@nebula-lab/primitives@2.0.0`)
 *    — not a single repo-wide base. A shared base (e.g. `git describe --tags
 *    --abbrev=0` with no `--match`) picks whichever tag is most recent by
 *    commit ancestry, which is a different tag per package once packages
 *    release independently and diverge — diffing package A against package
 *    B's tag can silently miss real changes to A made before B's tag but
 *    after A's own last release. Each package's diff base is resolved from
 *    its own tag series so this can't happen. A package with no tag yet
 *    (never released) diffs from the repo's root commit, so it's always
 *    included in its first release.
 *
 *    Deliberately a plain per-directory `git diff`, not `nx show projects
 *    --affected`: `--affected` answers "does this need re-testing" (which
 *    pulls in every transitive dependent whenever a leaf package changes,
 *    even a dependent with zero real changes of its own — confirmed
 *    empirically: `@nebula-lab/hooks` showed up as "affected" by a one-line
 *    `primitives/tsup.config.ts` edit despite owning zero changed files),
 *    not "does this need a new npm version." Publishing wants the second,
 *    stricter question.
 * 2. The cascade rule — `react-ui` is built on `primitives`/`hooks`/
 *    `headless`/`styleless`, and `react-ui-blocks` is built on
 *    `react-ui`/`primitives`/`hooks` (verified via `nx graph`), so if any
 *    of the foundational packages directly changed, both `react-ui` and
 *    `react-ui-blocks` are force-included even with zero direct changes of
 *    their own — otherwise they'd ship pinned against a dependency version
 *    that no longer matches what's actually on disk. This does **not**
 *    run in the other direction: a `react-ui`-only change does not force
 *    `react-ui-blocks` to release (nothing depends on `react-ui-blocks`,
 *    and its existing dependency range on `react-ui` is left alone unless
 *    `react-ui-blocks` itself changed) — a deliberate, explicit product
 *    decision, not an oversight: publish only what actually needs a new
 *    version, not everything downstream of it.
 *
 * Usage: node determine-release-projects.mjs
 * Prints a comma-separated project-name list (possibly empty) to stdout.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const FOUNDATIONAL = [
  '@nebula-lab/primitives',
  '@nebula-lab/hooks',
  '@nebula-lab/headless',
  '@nebula-lab/styleless',
  '@nebula-lab/utilities',
];

const packagesDir = 'packages';
const packageDirs = readdirSync(packagesDir).filter((dir) =>
  existsSync(join(packagesDir, dir, 'package.json')),
);

/** The root commit is the correct diff base for a package with no release tag yet — everything it owns is "new" relative to it, so a first-ever release is always picked up. */
function rootCommit() {
  return execFileSync('git', ['rev-list', '--max-parents=0', 'HEAD'], { encoding: 'utf8' })
    .trim()
    .split('\n')[0];
}

/** Resolves `name`'s own last release tag (`--match` scopes `git describe` to that package's tag series specifically, not whichever tag is newest repo-wide), falling back to the root commit when the package has never been tagged. */
function resolveBase(name) {
  try {
    return execFileSync(
      'git',
      ['describe', '--tags', '--abbrev=0', '--match', `${name}@*`, 'HEAD'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
  } catch {
    return rootCommit();
  }
}

const changed = new Set();
for (const dir of packageDirs) {
  const pkgJson = JSON.parse(readFileSync(join(packagesDir, dir, 'package.json'), 'utf8'));
  const base = resolveBase(pkgJson.name);
  const diff = execFileSync(
    'git',
    ['diff', '--name-only', `${base}...HEAD`, '--', `${packagesDir}/${dir}/`],
    { encoding: 'utf8' },
  ).trim();
  if (diff) {
    changed.add(pkgJson.name);
  }
}

if ([...changed].some((name) => FOUNDATIONAL.includes(name))) {
  changed.add('@nebula-lab/react-ui');
  changed.add('@nebula-lab/react-ui-blocks');
}

process.stdout.write([...changed].join(','));
