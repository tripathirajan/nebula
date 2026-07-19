# 1.0.0 (2026-07-19)

### 🚀 Features

- **react-ui:** add Backdrop component, blur intensity, and fix SwipeableCards/Carousel gaps ([9784f5d](https://github.com/tripathirajan/nebula/commit/9784f5d))
- **react-ui,react-ui-blocks,hooks:** fix vertical Carousel, add swipe/wheel navigation, SwipeableCards, PromoBanner ([e3922db](https://github.com/tripathirajan/nebula/commit/e3922db))
- **react-ui,react-ui-blocks:** add List family, VirtualList, and a responsive card/table list ([f69670d](https://github.com/tripathirajan/nebula/commit/f69670d))
- **react-ui:** add KbdShortcut component ([a2748e2](https://github.com/tripathirajan/nebula/commit/a2748e2))
- **react-ui:** add Alert component ([ea8bbbb](https://github.com/tripathirajan/nebula/commit/ea8bbbb))
- **styleless,react-ui:** add PasswordStrengthIndicator ([ecc4efe](https://github.com/tripathirajan/nebula/commit/ecc4efe))
- **styleless:** extract DataGrid's virtualized state into packages/styleless ([c8ce78e](https://github.com/tripathirajan/nebula/commit/c8ce78e))
- **styleless:** extract DataTable's real state into packages/styleless ([d011617](https://github.com/tripathirajan/nebula/commit/d011617))
- **styleless:** extract CodeBlock; resolve LAYER_TAXONOMY.md's remaining candidates ([ccf3502](https://github.com/tripathirajan/nebula/commit/ccf3502))
- **react-ui:** add dropdown variant to ThemeSwitcher ([a057d2d](https://github.com/tripathirajan/nebula/commit/a057d2d))
- **react-ui-blocks:** add Invoice List composition (Phase 7 complete) ([d4685b3](https://github.com/tripathirajan/nebula/commit/d4685b3))
- **react-ui-blocks:** add ProductGallery, ProductInfoPanel, Product Details composition ([72e68ba](https://github.com/tripathirajan/nebula/commit/72e68ba))
- **react-ui-blocks:** add ChatWindow to communication vertical ([59c78ed](https://github.com/tripathirajan/nebula/commit/59c78ed))
- **react-ui-blocks:** add Analytics Overview, Banking Home, User List compositions ([1093266](https://github.com/tripathirajan/nebula/commit/1093266))
- **react-ui-blocks:** add ProfileHeader (new social vertical), TeamMemberCard, extend ListingCard ([e56447d](https://github.com/tripathirajan/nebula/commit/e56447d))
- **react-ui-blocks): add EntityFormLayout and ListingCard; fix(react-ui:** Button danger ghost/text contrast ([194a716](https://github.com/tripathirajan/nebula/commit/194a716))
- **react-ui-blocks:** add RankedList, ThumbnailList, ReviewsList to dashboard/widgets ([62d3f36](https://github.com/tripathirajan/nebula/commit/62d3f36))
- **react-ui-blocks:** add dashboard/billing family - BalanceCard, BillingSummaryCard, PlanCards, PaymentMethodList ([b4612f6](https://github.com/tripathirajan/nebula/commit/b4612f6))
- **react-ui-blocks:** extend ChartCard with line/area/radar/gauge types ([66799be](https://github.com/tripathirajan/nebula/commit/66799be))
- add Sparkline atom, DataTableBlock organism, DashboardOverview trend/sparkline support ([6dbe7c1](https://github.com/tripathirajan/nebula/commit/6dbe7c1))
- **react-ui:** add motion/elevation/z-index token system (design refresh phase 1) ([dd8bd3c](https://github.com/tripathirajan/nebula/commit/dd8bd3c))
- **react-ui-blocks:** add ChartCard, WelcomeBanner, and a dashboard-home composition ([42312fa](https://github.com/tripathirajan/nebula/commit/42312fa))
- **react-ui-blocks:** add FilterBar and NotificationCenter blocks ([1d294bd](https://github.com/tripathirajan/nebula/commit/1d294bd))
- **react-ui-blocks:** redesign SaasAppHeader — logo, dropdown menus, notification bell, richer profile widget ([cd24883](https://github.com/tripathirajan/nebula/commit/cd24883))
- added more variant ([4d9a0f9](https://github.com/tripathirajan/nebula/commit/4d9a0f9))
- added more react-ui components ([5ba7b7e](https://github.com/tripathirajan/nebula/commit/5ba7b7e))
- added more react-ui components ([c319fe9](https://github.com/tripathirajan/nebula/commit/c319fe9))
- added styleless components ([a5493a4](https://github.com/tripathirajan/nebula/commit/a5493a4))
- added more ui blocks ([4f79d03](https://github.com/tripathirajan/nebula/commit/4f79d03))
- added new react-ui components with some bug fixes ([12f5d31](https://github.com/tripathirajan/nebula/commit/12f5d31))

### 🩹 Fixes

- **release:** restore workspace:* protocol for internal deps on main ([2dee20b](https://github.com/tripathirajan/nebula/commit/2dee20b))
- **release:** sync main's package.json to what's actually published ([5678792](https://github.com/tripathirajan/nebula/commit/5678792))
- **release:** commit the version bump, and correct the stuck version state ([a193053](https://github.com/tripathirajan/nebula/commit/a193053))
- **release:** mark all publishable packages as publicly accessible ([07233d3](https://github.com/tripathirajan/nebula/commit/07233d3))
- **release:** rename npm scope from @nebula to @nebula-lab ([042abd9](https://github.com/tripathirajan/nebula/commit/042abd9))
- **react-ui:** give ImageUpload's remove button a real background ([180a8f9](https://github.com/tripathirajan/nebula/commit/180a8f9))
- **react-ui,react-ui-blocks:** visual fixes from design review ([97b5d43](https://github.com/tripathirajan/nebula/commit/97b5d43))
- **react-ui:** focus-ring/icon-size design-system follow-ups from Phase 1 plan ([580455c](https://github.com/tripathirajan/nebula/commit/580455c))
- **react-ui-blocks:** give ChatWindow's transcript an ARIA live region ([f8dee21](https://github.com/tripathirajan/nebula/commit/f8dee21))
- error fixes ([d6d940b](https://github.com/tripathirajan/nebula/commit/d6d940b))
- **react-ui:** enable splitting:true to dedupe Context across entry points ([181a535](https://github.com/tripathirajan/nebula/commit/181a535))
- build issues ([37e22be](https://github.com/tripathirajan/nebula/commit/37e22be))
- BottomNav interaction test hidden behind md:hidden viewport ([f09b474](https://github.com/tripathirajan/nebula/commit/f09b474))
- clean up lint errors and stabilize BottomNav storybook test ([23a58e5](https://github.com/tripathirajan/nebula/commit/23a58e5))
- color scheme and padding ([6edeebf](https://github.com/tripathirajan/nebula/commit/6edeebf))
- updated color scheme ([b5a38df](https://github.com/tripathirajan/nebula/commit/b5a38df))
- shrink --radius-popover so menu/context-menu/menubar items don't clip into the corners ([8c33085](https://github.com/tripathirajan/nebula/commit/8c33085))
- repair infinite-render loops, event-bubbling, and a11y bugs in new @nebula/headless components ([df8ea41](https://github.com/tripathirajan/nebula/commit/df8ea41))
- repair test isolation, focus/dismiss races, and a11y test gaps ([e0d20bd](https://github.com/tripathirajan/nebula/commit/e0d20bd))
- color-scheme for primary button text ([30f6cbc](https://github.com/tripathirajan/nebula/commit/30f6cbc))
- apply default theme ([4b26b3c](https://github.com/tripathirajan/nebula/commit/4b26b3c))

### 🔥 Performance

- **react-ui-blocks:** import from react-ui subpaths, add bundle-size plan ([6bcd627](https://github.com/tripathirajan/nebula/commit/6bcd627))

### ❤️ Thank You

- Rajan Tripathi @tripathirajan