// Barrel only — zero logic. Re-exports the domain-neutral core only (see
// BLOCKS_ARCHITECTURE.md §0/§1) — vertical categories (marketing, ecommerce,
// dashboard, authentication, ...) are reachable only via their own subpath
// export (e.g. `@nebula/react-ui-blocks/authentication`), never from here.
export * from './core/theme-switcher';
export * from './layouts/app-layout';
export * from './layouts/auth-layout';
export * from './layouts/dashboard-layout';
export * from './layouts/settings-layout';
export * from './forms/transaction-form';
