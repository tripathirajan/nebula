import * as React from 'react';

import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

/**
 * Mount-ordered stack of currently-open layers (module-level, shared across
 * every `DismissibleLayer` instance in the app) — so that with nested
 * overlays (a `Popover` inside a `Dialog`, say), an outside click or Escape
 * dismisses only the topmost one instead of every open layer at once.
 */
const openLayers: HTMLElement[] = [];

interface DismissibleLayerProps extends PrimitivePropsWithRef<'div'> {
  /** Called on Escape keydown, only when this is the topmost open layer. Call `event.preventDefault()` to stop `onDismiss` from also firing. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called on a pointerdown outside this layer's subtree, only when this is the topmost open layer. Call `event.preventDefault()` to stop `onDismiss` from also firing. */
  onPointerDownOutside?: (event: PointerEvent) => void;
  /** Fires after `onEscapeKeyDown`/`onPointerDownOutside` unless that handler called `preventDefault()` — the common case, wire this to close the layer. */
  onDismiss?: () => void;
}

/**
 * Escape-key and outside-pointerdown dismissal for overlays, with correct
 * layering: only the topmost mounted `DismissibleLayer` responds, so
 * closing a nested popover doesn't also close the dialog underneath it.
 * Pairs with `Portal` + `FocusScope` for the full Dialog/Popover pattern.
 *
 * @example
 * ```tsx
 * <Portal>
 *   <DismissibleLayer onDismiss={() => setOpen(false)}>
 *     <FocusScope trapped>{content}</FocusScope>
 *   </DismissibleLayer>
 * </Portal>
 * ```
 */
const DismissibleLayer = React.forwardRef<HTMLDivElement, DismissibleLayerProps>(
  (props, forwardedRef) => {
    const { onEscapeKeyDown, onPointerDownOutside, onDismiss, ...layerProps } = props;
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, nodeRef);

    React.useEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      openLayers.push(node);
      return () => {
        const index = openLayers.indexOf(node);
        if (index !== -1) openLayers.splice(index, 1);
      };
    }, []);

    React.useEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      // Not `openLayers[openLayers.length - 1] === node`: React fires
      // mount effects bottom-up (children before parents), so a nested
      // layer's effect — and its `openLayers.push` — runs *before* its
      // ancestor's, leaving the outer layer last in the array instead of
      // the inner one. DOM containment is reliable regardless of effect
      // order: the topmost layer is whichever currently-open layer doesn't
      // itself contain another currently-open one.
      const isTopmost = () =>
        !openLayers.some((other) => other !== node && node.contains(other));

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !isTopmost()) return;
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      };

      const onPointerDown = (event: PointerEvent) => {
        if (!isTopmost()) return;
        const target = event.target as Node | null;
        if (target && node.contains(target)) return;
        onPointerDownOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      };

      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('pointerdown', onPointerDown, true);
      };
    }, [onEscapeKeyDown, onPointerDownOutside, onDismiss]);

    return <Primitive as="div" {...layerProps} ref={composedRef} />;
  },
);

DismissibleLayer.displayName = 'DismissibleLayer';

export { DismissibleLayer };
export type { DismissibleLayerProps };
