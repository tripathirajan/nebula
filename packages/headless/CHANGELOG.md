# 1.0.0 (2026-07-19)

### 🚀 Features

- added more variant ([4d9a0f9](https://github.com/tripathirajan/nebula/commit/4d9a0f9))

### 🩹 Fixes

- **release:** restore workspace:* protocol for internal deps on main ([2dee20b](https://github.com/tripathirajan/nebula/commit/2dee20b))
- **release:** sync main's package.json to what's actually published ([5678792](https://github.com/tripathirajan/nebula/commit/5678792))
- **release:** commit the version bump, and correct the stuck version state ([a193053](https://github.com/tripathirajan/nebula/commit/a193053))
- **release:** mark all publishable packages as publicly accessible ([07233d3](https://github.com/tripathirajan/nebula/commit/07233d3))
- **release:** rename npm scope from @nebula to @nebula-lab ([042abd9](https://github.com/tripathirajan/nebula/commit/042abd9))
- **headless:** stop Dialog/AlertDialog/Drawer's aria-describedby from dangling ([1b064ad](https://github.com/tripathirajan/nebula/commit/1b064ad))
- **headless:** stop Field's aria-describedby from dangling when unrendered ([e1091a0](https://github.com/tripathirajan/nebula/commit/e1091a0))
- **headless:** stop pointing aria-controls at unmounted content while closed ([5015740](https://github.com/tripathirajan/nebula/commit/5015740))
- repair Storybook crashes in react-ui — duplicated React Context across headless's tsup entries, and ResizeObserver on a virtual anchor ([1d28529](https://github.com/tripathirajan/nebula/commit/1d28529))
- repair infinite-render loops, event-bubbling, and a11y bugs in new @nebula/headless components ([df8ea41](https://github.com/tripathirajan/nebula/commit/df8ea41))

### ❤️ Thank You

- Rajan Tripathi @tripathirajan