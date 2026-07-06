// Thin re-export straight from `@nebula/styleless`: `ContextMenuTrigger`
// renders a plain, chrome-free `div` wrapping arbitrary consumer content (see
// the styleless source's doc comment) — there is nothing for this package to
// style, the same reasoning `DialogTrigger`/`SelectPortal` are re-exported
// as-is for.
export { ContextMenuTrigger } from '@nebula/styleless/context-menu';
export type { ContextMenuTriggerProps } from '@nebula/styleless/context-menu';
