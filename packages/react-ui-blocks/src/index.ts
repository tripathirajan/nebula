// Barrel only — zero logic. Re-exports the domain-neutral core only (see
// BLOCKS_ARCHITECTURE.md §0/§1) — vertical categories (marketing, ecommerce,
// dashboard, authentication, ...) are reachable only via their own subpath
// export (e.g. `@nebula/react-ui-blocks/authentication`), never from here.
// `ThemeSwitcher` and `FilterBar` used to live here (this package's own
// `core` and `forms` categories, respectively) — moved to
// `@nebula/react-ui/theme-switcher` and `@nebula/react-ui/filter-bar`,
// since neither has domain knowledge of its own and this package is
// organisms only (see each component's own doc comment for the full
// reasoning).
export * from './navigation/headers';
export * from './layouts/app-layout';
export * from './layouts/auth-layout';
export * from './layouts/dashboard-layout';
export * from './layouts/settings-layout';
export * from './layouts/page-section';
export * from './forms/transaction-form';
export * from './forms/entity-form-layout';
export * from './data-display/data-table';
export * from './data-display/listing-card';
export * from './data-display/card-list-item';
