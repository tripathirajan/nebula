---
name: release-checklist
description: Walk through the pre-flight checks, dispatch, and post-publish verification for nebula's "Publish Package" GitHub Actions workflow, per CONTRIBUTING.md's documented release flow. Use whenever asked to "publish a package", "cut a release", "publish a beta", "publish the latest version", or before dispatching the Publish Package workflow for any reason.
---

# release-checklist

Publishing is a real, external, hard-to-reverse action (npm registry + GitHub Releases) — this skill exists because a prior session hit two of the "known gotchas" below in a row (a broken `latest` dist-tag from an old failed run, and `nx release version`'s dependent-rewrite pinning bug breaking the very next CI install) before catching them. Follow every step; don't skip the verification steps just because the workflow run shows green — see CONTRIBUTING.md's own "don't trust a green checkmark alone" warning.

## 0. Confirm scope with the user first

Publishing is explicit-permission-required, not something to dispatch unprompted. Before doing anything, confirm:
- **Bump type**: `patch` / `minor` / `major` / `prerelease`. If any package lost a public export or changed a signature since its last release (check with `git log <tag>..HEAD -- packages/<pkg>` per package), that's a real breaking change — recommend `major` for it, but the maintainer makes the final call since bump type is a versioning-policy decision, not a technical one.
- **Tag**: `latest` for a real release, `beta` (or another prerelease tag) for a prerelease. Never assume — ask.

## 1. Pre-flight: sync branches

The workflow **must** run against `release`, not `main` (`main`'s branch protection requires PR review, which `github-actions[bot]` can't satisfy for its own version-bump commit).

```bash
git status                    # make sure there's nothing uncommitted first
git push origin main          # if local main has unpushed commits
git checkout release
git pull
git merge main --no-edit
git push
git checkout main
```

If the merge conflicts on package.json `"version"` fields, resolve in favor of whichever version is actually correct on the npm registry (check with `npm view @nebula-lab/<pkg> dist-tags` — see step 4) — not blindly "ours" or "theirs".

## 2. Dispatch

```bash
gh workflow run "Publish Package" --ref release -f bump=<bump> -f preid=beta -f tag=<tag>
```

(`preid` only matters when `bump=prerelease`; omit or leave default otherwise.)

Then watch it to actual completion rather than firing-and-forgetting:

```bash
gh run list --workflow="Publish Package" --limit 1   # get the run ID
gh run watch <run-id> --exit-status
```

## 3. Known gotcha #1: pinned internal dependencies

`nx release version`'s dependent-rewrite step pins internal `@nebula-lab/*` dependency ranges to literal versions (correct for the published npm tarball) instead of leaving them `workspace:*` in the **committed** package.json on `release`/`main`. This breaks pnpm's workspace-symlinking and fails the next `pnpm install --frozen-lockfile` in CI — confirmed to actually happen, not just a theoretical risk.

**After every successful publish**, before doing anything else:

```bash
git checkout release && git pull
grep -rn '"@nebula-lab/' packages/*/package.json | grep -v 'workspace:\*' | grep -v '"name"'
```

If that finds anything, fix it:

```bash
# for each flagged line, replace the pinned version with "workspace:*"
pnpm install   # should report "Already up to date" — confirms the lockfile never needed the pin
git add packages/*/package.json pnpm-lock.yaml
git commit -m "fix(release): revert nx's pinned internal @nebula-lab/* deps to workspace:*"
git push
git checkout main && git merge release --no-edit && git push
```

## 4. Known gotcha #2: verify the actual registry state, not just the workflow's green checkmark

A run can report success while silently publishing nothing new (if `nx release version` computes a version that already exists on the registry — this happens when a package's git tag is out of sync with what's actually published, see gotcha #3) or while leaving `latest` pointed somewhere stale from an old broken run.

For **every** package this dispatch was supposed to touch:

```bash
curl -s "https://registry.npmjs.org/@nebula-lab%2F<pkg>" | node -e "
let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
  const j=JSON.parse(d);
  console.log('dist-tags:', JSON.stringify(j['dist-tags']));
  const times = Object.entries(j.time).filter(([v])=>v!=='created'&&v!=='modified').sort((a,b)=>new Date(a[1])-new Date(b[1]));
  console.log('last publish:', times.at(-1));
});"
```

Confirm: (a) the `dist-tags` entry for the tag you dispatched with now points at a **new** version, and (b) the last-publish timestamp is genuinely from just now, not days old. Also spot-check `fileCount`/`unpackedSize` aren't suspiciously tiny (an empty/broken publish has looked identical to a successful one in this workflow's logs before) and check `gh release list` for the matching new GitHub Release per package.

## 5. Known gotcha #3: git tags must match what's actually on npm

`nx release version` resolves each package's "current version" from its own git tag (`@nebula-lab/<pkg>@x.y.z`), **not** from package.json or the npm registry. If a prior run published successfully to npm but failed before its tagging step, the git tag silently falls behind reality — every subsequent dispatch then recomputes the same already-published version and no-ops without erroring.

If step 4 shows a package didn't actually get a new version despite being in the dispatch's project list, check:

```bash
git tag -l "@nebula-lab/<pkg>@*" | sort -V | tail -3
npm view @nebula-lab/<pkg> versions --json | tail -5
```

If the highest npm version has no matching git tag, reconcile: bump that package's `package.json` version on `main` to match npm's actual highest published version, commit, tag it (`git tag @nebula-lab/<pkg>@x.y.z`), push both, then re-sync `release` (step 1) and re-dispatch.

## 6. Merge release back into main

Once everything above checks out clean:

```bash
git checkout main
git merge release --no-edit
git push
```

Keeps `main`'s `package.json`/`CHANGELOG.md` files from drifting out of sync with what's actually published.
