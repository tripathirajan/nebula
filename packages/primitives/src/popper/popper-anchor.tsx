import * as React from 'react';

import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';

import { usePopperContext } from './popper-context';

import type { ScopedProps } from './popper-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';

const POPPER_ANCHOR_NAME = 'PopperAnchor';

type PopperAnchorProps = PrimitivePropsWithRef<'div'>;

/**
 * Marks the element `PopperContent` measures and positions itself against.
 * Registration is just `composeRefs(forwardedRef, context.onAnchorChange)` —
 * `onAnchorChange` (the `Popper` root's `setAnchor`) is itself a valid ref
 * callback shape (`(node) => void`), so `composeRefs`' existing
 * mount-registers/unmount-clears-to-`null` behavior handles anchor
 * registration for free, no extra effect needed.
 *
 * @example
 * ```tsx
 * <PopperAnchor asChild>
 *   <button>Open</button>
 * </PopperAnchor>
 * ```
 */
const PopperAnchor = React.forwardRef<HTMLDivElement, ScopedProps<PopperAnchorProps>>(
  (props, forwardedRef) => {
    const { __scopePopper, ...anchorProps } = props;
    const context = usePopperContext(POPPER_ANCHOR_NAME, __scopePopper);
    const composedRef = useComposedRefs(forwardedRef, context.onAnchorChange);

    return <Primitive as="div" {...anchorProps} ref={composedRef} />;
  },
);

PopperAnchor.displayName = POPPER_ANCHOR_NAME;

export { PopperAnchor };
export type { PopperAnchorProps };
