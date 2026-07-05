import * as React from 'react';

import { composeRefs } from '../compose-refs/compose-refs';

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

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    // The new element to render is the one passed as a child of `Slottable`.
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // Because the new element will be the one rendered, we are only
        // interested in grabbing its children (`newElement.props.children`).
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return React.isValidElement(newElement)
          ? (newElement.props as { children?: React.ReactNode }).children
          : null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = 'Slot';

interface SlotCloneProps {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<unknown, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (React.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props as Record<string, unknown>),
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
    });
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});

SlotClone.displayName = 'SlotClone';

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
const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

type AnySlottableElement = React.ReactElement<{ children?: React.ReactNode }>;

function isSlottable(child: React.ReactNode): child is AnySlottableElement {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  // all child props should override
  const overrideProps: Record<string, unknown> = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          (childPropValue as (...a: unknown[]) => unknown)(...args);
          (slotPropValue as (...a: unknown[]) => unknown)(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...(slotPropValue as object), ...(childPropValue as object) };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

// Reads the ref off an element in a way that works for both the legacy
// `element.ref` and (React 19+) `element.props.ref` locations.
function getElementRef(element: React.ReactElement) {
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get;
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element as unknown as { ref: React.Ref<unknown> }).ref;
  }

  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get;
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref;
  }

  return (
    (element.props as { ref?: React.Ref<unknown> }).ref ||
    (element as unknown as { ref?: React.Ref<unknown> }).ref
  );
}

export { Slot, Slottable, getElementRef };
export type { SlotProps };
