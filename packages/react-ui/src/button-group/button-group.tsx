import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface ButtonGroupOwnProps {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

type ButtonGroupProps = PrimitivePropsWithRef<'div'> & ButtonGroupOwnProps;

/**
 * Visually merges a row (or column) of adjacent `Button`/`IconButton`s into
 * one segmented control — purely a CSS trick via child-combinator Tailwind
 * classes (`[&>*:not(:first-child)]:...`), no shared state or roving
 * tabindex of its own: each button keeps its own independent click
 * behavior and its own place in the normal `Tab` order, unlike
 * `ToggleGroup`'s actual arrow-key-navigated single/multi-select state
 * machine. Reach for `ToggleGroup` instead when the buttons need to track
 * a pressed/selected value; reach for this when they're just independent
 * actions (e.g. "Cut / Copy / Paste") that happen to look attached.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button color="secondary">Cut</Button>
 *   <Button color="secondary">Copy</Button>
 *   <Button color="secondary">Paste</Button>
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>((props, forwardedRef) => {
  const { className, orientation = 'horizontal', role = 'group', ...rest } = props;
  const isHorizontal = orientation === 'horizontal';

  return (
    <Primitive
      as="div"
      role={role}
      data-orientation={orientation}
      className={cn(
        'inline-flex',
        isHorizontal
          ? '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none'
          : 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
        '[&>*]:relative [&>*:focus-visible]:z-10',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
export type { ButtonGroupProps };
