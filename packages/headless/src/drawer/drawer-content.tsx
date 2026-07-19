import { DismissibleLayer } from '@nebula-lab/primitives/dismissible-layer';
import { FocusScope } from '@nebula-lab/primitives/focus-scope';
import { Presence } from '@nebula-lab/primitives/presence';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useDialogContext } from '../dialog/dialog-context';

import type { ScopedProps } from '../dialog/dialog-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const DRAWER_CONTENT_NAME = 'DrawerContent';

type DrawerSide = 'top' | 'right' | 'bottom' | 'left';

interface DrawerContentProps extends PrimitivePropsWithRef<'div'> {
  /** Which edge of the viewport the panel is anchored to — exposed as
   * `data-side` for the consumer's own CSS to position/animate from (a
   * fixed-position panel sliding in from that edge is a purely visual
   * concern this unstyled layer doesn't own). @default 'right' */
  side?: DrawerSide;
  /** Keep mounted while closed instead of unmounting — same escape hatch as `DialogContent`'s `forceMount`. @default false */
  forceMount?: boolean;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop Escape from closing the drawer. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop an outside click from closing the drawer. */
  onPointerDownOutside?: (event: PointerEvent) => void;
}

/**
 * `role="dialog"`, rendered inside `DrawerPortal` — identical composition to
 * `DialogContent` (`Presence` > `DismissibleLayer` > `FocusScope` via
 * `asChild` chaining, `trapped` following the root's `modal`), reusing
 * `Dialog`'s context directly (same cross-folder relative-import pattern
 * `AlertDialogContent` uses). The only addition is `side`/`data-side`: a
 * drawer's whole visual identity is "the panel enters from an edge instead
 * of appearing centered," which is exactly the kind of thing this unstyled
 * layer leaves to the consumer's CSS (`data-[side=right]:translate-x-full`
 * etc.) rather than baking in an animation implementation.
 *
 * @example
 * ```tsx
 * <DrawerContent side="right" className="fixed inset-y-0 right-0 w-80 data-[state=closed]:translate-x-full">
 *   <DrawerTitle>Your cart</DrawerTitle>
 * </DrawerContent>
 * ```
 */
const DrawerContent = React.forwardRef<HTMLDivElement, ScopedProps<DrawerContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeDialog,
      side = 'right',
      forceMount = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useDialogContext(DRAWER_CONTENT_NAME, __scopeDialog);
    const describedBy = context.describedByIds.length > 0 ? context.describedByIds.join(' ') : undefined;

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          ref={forwardedRef}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={() => context.onOpenChange(false)}
        >
          <FocusScope asChild trapped={context.modal}>
            <Primitive
              as="div"
              role="dialog"
              id={context.contentId}
              aria-modal={context.modal}
              aria-labelledby={context.titleId}
              aria-describedby={describedBy}
              data-state={context.open ? 'open' : 'closed'}
              data-side={side}
              {...contentProps}
            />
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

DrawerContent.displayName = DRAWER_CONTENT_NAME;

export { DrawerContent };
export type { DrawerContentProps, DrawerSide };
