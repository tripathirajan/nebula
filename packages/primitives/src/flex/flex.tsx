import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const DIRECTION_CLASSES: Record<FlexDirection, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
};

const ALIGN_CLASSES: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_CLASSES: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

interface FlexOwnProps {
  /** @default 'row' */
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  /** @default false */
  wrap?: boolean;
  /**
   * Gap between children. Applied as an inline style (not a Tailwind class)
   * so arbitrary values work without needing to be present verbatim in
   * source for Tailwind's content scanner — pass a number for `px` or any
   * valid CSS gap value (`'1rem'`, `'clamp(...)'`, ...).
   */
  gap?: number | string;
}

/** Props accepted by {@link Flex}. */
type FlexProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E, FlexOwnProps>;

/**
 * A `display: flex` container with small, literal-CSS convenience props
 * (`direction`, `align`, `justify`, `wrap`, `gap`) instead of hand-written
 * Tailwind flex utility classes — see `component-library-architecture.md`
 * §6 ("thin Tailwind-token-driven layout primitives so consumers don't
 * write raw flex/grid classes").
 *
 * @example
 * ```tsx
 * <Flex direction="column" gap={12}>
 *   <span>Row one</span>
 *   <span>Row two</span>
 * </Flex>
 *
 * <Flex justify="between" align="center" as="nav">
 *   <Logo />
 *   <NavLinks />
 * </Flex>
 * ```
 */
const Flex = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: FlexProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { direction = 'row', align, justify, wrap = false, gap, className, style, ...rest } =
      props;

    return (
      <Primitive
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn(
          'flex',
          DIRECTION_CLASSES[direction],
          align && ALIGN_CLASSES[align],
          justify && JUSTIFY_CLASSES[justify],
          wrap && 'flex-wrap',
          className,
        )}
        style={gap === undefined ? style : { ...style, gap }}
      />
    );
  },
) as PolymorphicComponent<'div', FlexOwnProps>;

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps, FlexDirection, FlexAlign, FlexJustify, FlexOwnProps };
