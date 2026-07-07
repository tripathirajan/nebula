// Thin re-export straight from `@nebula/headless`: `ContextMenuTrigger`
// renders a plain, chrome-free `div` wrapping arbitrary consumer content (see
// the headless source's doc comment) — there is nothing for this package to
// style, the same reasoning `DialogTrigger`/`SelectPortal` are re-exported
// as-is for.
export { ContextMenuTrigger } from '@nebula/headless/context-menu';
export type { ContextMenuTriggerProps } from '@nebula/headless/context-menu';
