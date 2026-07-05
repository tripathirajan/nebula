import * as React from 'react';

import { cn } from '../cn/cn';
import { Primitive } from '../primitive/primitive';

import type { PrimitiveProps } from '../primitive/primitive';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_CLASSES: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-none',
};

interface ContainerOwnProps {
  /** @default 'lg' */
  size?: ContainerSize;
}

/** Props accepted by {@link Container}. */
type ContainerProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  E,
  ContainerOwnProps
>;

/**
 * Horizontally centers its content and caps its width at `size` — the
 * standard "page content shouldn't stretch full-bleed on a wide monitor"
 * wrapper. Adds responsive horizontal padding so content doesn't touch the
 * viewport edge on small screens.
 *
 * @example
 * ```tsx
 * <Container size="md">
 *   <Heading as="h1">Settings</Heading>
 *   <SettingsForm />
 * </Container>
 * ```
 */
const Container = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: ContainerProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    const { size = 'lg', className, ...rest } = props;
    return (
      <Primitive
        {...(rest as PrimitiveProps<E>)}
        ref={forwardedRef}
        className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZE_CLASSES[size], className)}
      />
    );
  },
) as PolymorphicComponent<'div', ContainerOwnProps>;

Container.displayName = 'Container';

export { Container };
export type { ContainerProps, ContainerSize };
