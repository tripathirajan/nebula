// `DropdownMenu` is `Menu` under the name most consumers reach for first —
// a menu triggered by clicking a visible button is the overwhelmingly
// common case `Menu` was designed around (see `menu.tsx`'s header comment),
// so this is a renamed re-export rather than a second implementation.
export { Menu as DropdownMenu } from '../menu/menu';
export type { MenuProps as DropdownMenuProps } from '../menu/menu';
