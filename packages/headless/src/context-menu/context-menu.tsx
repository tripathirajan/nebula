// `ContextMenu`'s open/close contract (controlled/uncontrolled `open`,
// `Popper` + scoped context underneath) is identical to `Menu`'s — the only
// real behavioral difference is how it's triggered (right-click at a point
// vs. clicking a visible button), which lives entirely in
// `ContextMenuTrigger`. So, same reasoning as `DropdownMenu`, this is a
// renamed re-export rather than a second Root implementation.
export { Menu as ContextMenu } from '../menu/menu';
export type { MenuProps as ContextMenuProps } from '../menu/menu';
