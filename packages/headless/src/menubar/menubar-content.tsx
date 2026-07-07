// Thin renamed re-export of `MenuContent`. Positions against whichever real
// `PopperAnchor` this menu's own `MenubarTrigger` registered — no
// menubar-specific positioning logic needed here (unlike `ContextMenu`,
// which needs a virtual point anchor, a `Menubar`'s menus always anchor off
// a real, visible trigger button).
export { MenuContent as MenubarContent } from '../menu/menu-content';
export type { MenuContentProps as MenubarContentProps } from '../menu/menu-content';
