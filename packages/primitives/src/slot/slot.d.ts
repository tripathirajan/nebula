import * as React from 'react';
/**
 * `Slot` merges the props (and ref) it receives onto its single child element
 * instead of rendering a DOM node of its own. It's what powers `asChild` on
 * every Nebula primitive: `<Button asChild><a href="/">Link button</a></Button>`
 * renders an `<a>` with all of Button's behavior/aria/event-handler props
 * merged in, rather than a `<button>` wrapping an `<a>`. Event handlers
 * compose (both fire), `className`/`style` merge, and everything else on the
 * child wins over the slotted prop of the same name.
 *
 * Most of the time you won't use `Slot` directly — `Primitive` already uses
 * it internally for its `asChild` prop, so reach for `asChild` on whatever
 * component you're using instead. Use `Slot` directly when hand-building a
 * component that isn't going through `Primitive` for some reason.
 *
 * @example
 * ```tsx
 * function IconButton({ asChild, ...props }: { asChild?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
 *   const Comp = asChild ? Slot : 'button';
 *   return <Comp className="rounded p-2" {...props} />;
 * }
 *
 * // Renders an <a>, not a <button>, with IconButton's className merged in:
 * <IconButton asChild><a href="/settings"><GearIcon /></a></IconButton>
 * ```
 */
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}
declare const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
/**
 * Marks which child of a multi-child composite should receive the slotted
 * props when a component has more than one child and needs to disambiguate.
 *
 * @example
 * ```tsx
 * // Tooltip has two children — the trigger and its content — so it wraps
 * // the one that should receive Slot's props in `Slottable`:
 * function TooltipTrigger({ asChild, children, ...props }: TooltipTriggerProps) {
 *   const Comp = asChild ? Slot : 'button';
 *   return (
 *     <Comp {...props}>
 *       <Slottable>{children}</Slottable>
 *       <TooltipContentPortal />
 *     </Comp>
 *   );
 * }
 * ```
 */
declare const Slottable: ({ children }: {
    children: React.ReactNode;
}) => React.JSX.Element;
declare function getElementRef(element: React.ReactElement): React.Ref<unknown> | undefined;
export { Slot, Slottable, getElementRef };
export type { SlotProps };
//# sourceMappingURL=slot.d.ts.map