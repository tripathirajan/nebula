// Thin re-export straight from `@nebula-lab/headless`: mints its own unscoped
// `Menu` internally and renders no visible DOM of its own — nothing here for
// this package to style, same as this package's own `Menu` root.
export { MenubarMenu } from '@nebula-lab/headless/menubar';
export type { MenubarMenuProps } from '@nebula-lab/headless/menubar';
