// Thin renamed re-export of this package's own `Drawer` parts — a "Sheet"
// (the shadcn/Radix naming) and a "Drawer" (the Chakra/MUI naming) are the
// same edge-anchored overlay pattern under two different vocabularies; no
// project in this workspace needs both to look or behave differently, so
// this mirrors the `DropdownMenu`-reuses-`Menu` / `TreeView`-reuses-`Tree`
// convention rather than duplicating `DrawerContent`'s real `data-[side=*]`
// implementation a second time.
export {
  Drawer as Sheet,
  DrawerTrigger as SheetTrigger,
  DrawerPortal as SheetPortal,
  DrawerOverlay as SheetOverlay,
  DrawerContent as SheetContent,
  DrawerTitle as SheetTitle,
  DrawerDescription as SheetDescription,
  DrawerClose as SheetClose,
} from '../drawer';
export type {
  DrawerProps as SheetProps,
  DrawerTriggerProps as SheetTriggerProps,
  DrawerPortalProps as SheetPortalProps,
  DrawerOverlayProps as SheetOverlayProps,
  DrawerContentProps as SheetContentProps,
  DrawerSide as SheetSide,
  DrawerTitleProps as SheetTitleProps,
  DrawerDescriptionProps as SheetDescriptionProps,
  DrawerCloseProps as SheetCloseProps,
} from '../drawer';
