import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const LEVEL_SIZE_CLASSES: Record<HeadingLevel, string> = {
  1: 'text-3xl font-bold',
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold',
  6: 'text-sm font-semibold',
};

interface HeadingOwnProps {
  /**
   * Sets both the default rendered tag (`h1`..`h6`) and its size/weight —
   * override just the tag via `as` while keeping a different level's size,
   * e.g. `<Heading as="h2" level={1}>` for an `h2` that's sized like an
   * `h1` (semantics vs. visual hierarchy don't always match one-to-one).
   * @default 2
   */
  level?: HeadingLevel;
}

/** Props accepted by {@link Heading}. */
type HeadingProps<E extends React.ElementType = 'h2'> = PolymorphicComponentPropsWithRef<
  E,
  HeadingOwnProps
>;

/**
 * A heading with size/weight derived from `level` (1-6), independent of
 * which tag actually renders — so document outline (`as`/tag) and visual
 * hierarchy (`level`/size) can be set independently when they need to
 * diverge, while defaulting to matching (`level={2}` renders an `h2` sized
 * for a level-2 heading).
 *
 * @example
 * ```tsx
 * <Heading as="h1" level={1}>Page title</Heading>
 * <Heading as="h2" level={2}>Section title</Heading>
 *
 * // Visually smaller than an h2 despite being one, for a dense card title:
 * <Heading as="h2" level={4}>Card title</Heading>
 * ```
 */
const Heading = React.forwardRef(
  <E extends React.ElementType = 'h2'>(
    props: HeadingProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { level = 2, as, className, ...rest } = props;
    const Tag = (as ?? (`h${level}` as React.ElementType)) as React.ElementType;

    return (
      <Primitive
        as={Tag}
        {...rest}
        ref={forwardedRef}
        className={cn(LEVEL_SIZE_CLASSES[level], className)}
      />
    );
  },
) as PolymorphicComponent<'h2', HeadingOwnProps>;

Heading.displayName = 'Heading';

export { Heading };
export type { HeadingProps, HeadingLevel };
