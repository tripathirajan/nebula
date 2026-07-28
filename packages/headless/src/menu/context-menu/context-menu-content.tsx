// Thin renamed re-export of `MenuContent`. `ContextMenuTrigger` supplies a
// virtual point anchor (see its doc comment) rather than a real trigger
// element, but `MenuContent`'s positioning logic only ever reads the
// anchor's `getBoundingClientRect()` — it has no idea (and doesn't need to
// know) whether the anchor is a real element or a virtual point, so no
// content-side changes are needed to support context menus.
export { MenuContent as ContextMenuContent } from '../menu/menu-content';
export type { MenuContentProps as ContextMenuContentProps } from '../menu/menu-content';
