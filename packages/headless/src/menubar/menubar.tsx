
import { useControllableState } from '@nebula/hooks';
import { RovingFocusGroup } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';


import { MenubarProvider } from './menubar-context';

import type { ScopedProps } from './menubar-context';

interface MenubarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** Forwarded (along with the ref) to the root `RovingFocusGroup` element — added so a consumer (e.g. `react-ui`'s styled wrapper) can lay the bar out visually without needing an extra wrapping `<div>` around it. */
  className?: string;
  children?: React.ReactNode;
}

/**
 * `role="menubar"` — a horizontal row of `MenubarMenu`s (each its own
 * `Menu`) that share one rule: at most one open at a time. `value` names
 * which `MenubarMenu`'s (matching) `value` is currently open, `undefined`
 * meaning none are.
 *
 * Renders `RovingFocusGroup` directly as its root element (not via
 * `asChild`) so every `MenubarTrigger` rendered among `children` registers
 * into the same roving-tabindex group for Left/Right arrow navigation
 * between them — the same primitive `Tabs`/`RadioGroup`/`Menu` already build
 * their own roving-tabindex behavior on.
 *
 * @example
 * ```tsx
 * <Menubar>
 *   <MenubarMenu value="file">
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarPortal>
 *       <MenubarContent>
 *         <MenubarItem onSelect={() => save()}>Save</MenubarItem>
 *       </MenubarContent>
 *     </MenubarPortal>
 *   </MenubarMenu>
 *   <MenubarMenu value="edit">
 *     <MenubarTrigger>Edit</MenubarTrigger>
 *     <MenubarPortal>
 *       <MenubarContent>
 *         <MenubarItem onSelect={() => undo()}>Undo</MenubarItem>
 *       </MenubarContent>
 *     </MenubarPortal>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 */
const Menubar = React.forwardRef<HTMLDivElement, ScopedProps<MenubarProps>>((props, forwardedRef) => {
  const { __scopeMenubar, value: valueProp, defaultValue, onValueChange, className, children } =
    props;

  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <MenubarProvider scope={__scopeMenubar} value={value} onValueChange={setValue}>
      <RovingFocusGroup
        orientation="horizontal"
        loop
        role="menubar"
        className={className}
        ref={forwardedRef}
      >
        {children}
      </RovingFocusGroup>
    </MenubarProvider>
  );
});

Menubar.displayName = 'Menubar';

export { Menubar };
export type { MenubarProps };
