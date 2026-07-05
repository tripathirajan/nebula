import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

/**
 * The standard "visually hidden but still announced by screen readers"
 * technique — `display: none`/`visibility: hidden` remove content from the
 * accessibility tree entirely, which this deliberately avoids. Prefer this
 * over Tailwind's `sr-only` utility when you need the inline style to win
 * regardless of class ordering/specificity (e.g. inside a design-system
 * component whose consumer might pass a conflicting `className`).
 */
const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
};

/** Props accepted by {@link VisuallyHidden}. */
type VisuallyHiddenProps<E extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<E>;

/**
 * Hides content visually while keeping it in the accessibility tree — for
 * text that a sighted user doesn't need (a redundant label, an icon
 * button's accessible name) but a screen reader user does.
 *
 * @example
 * ```tsx
 * <button>
 *   <TrashIcon aria-hidden />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 * ```
 */
const VisuallyHidden = React.forwardRef(
  <E extends React.ElementType = 'span'>(
    props: VisuallyHiddenProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { as, style, ...rest } = props;
    return (
      <Primitive
        as={as ?? ('span' as E)}
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        style={{ ...visuallyHiddenStyle, ...style }}
      />
    );
  },
) as PolymorphicComponent<'span'>;

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
export type { VisuallyHiddenProps };
