import { Spacer as PrimitiveSpacer } from '@nebula-lab/primitives/spacer';
import * as React from 'react';

import type { SpacerOwnProps, SpacerProps as PrimitiveSpacerProps } from '@nebula-lab/primitives/spacer';
import type { PolymorphicComponent } from '@nebula-lab/primitives/types';

/**
 * Styled `Spacer` — thin re-export of `@nebula-lab/primitives`' `Spacer`,
 * an invisible `flex-grow`ing filler for pushing flex children to opposite
 * ends without hand-writing `justify="between"`.
 *
 * @example
 * ```tsx
 * <HStack>
 *   <Logo />
 *   <Spacer />
 *   <Button>Sign out</Button>
 * </HStack>
 * ```
 */
const Spacer = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: PrimitiveSpacerProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <PrimitiveSpacer {...(props as PrimitiveSpacerProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div', SpacerOwnProps>;

Spacer.displayName = 'Spacer';

export { Spacer };
export type { PrimitiveSpacerProps as SpacerProps };
