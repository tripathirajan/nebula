// Just a `Portal` — no visual chrome, nothing to style. Re-exported straight
// from this package's own `Popover` (renamed), the same "mint an ambient
// instance" reuse `ColorPickerPortal` makes of `PopoverPortal`.
export { PopoverPortal as MultiSelectPortal } from '../popover/popover-portal';
export type { PopoverPortalProps as MultiSelectPortalProps } from '../popover/popover-portal';
