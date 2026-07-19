import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useAvatarContext } from './avatar-context';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const AVATAR_FALLBACK_NAME = 'AvatarFallback';

interface AvatarFallbackOwnProps {
  /** Delay before rendering, so a fast-loading image doesn't flash the fallback first. */
  delayMs?: number;
}

type AvatarFallbackProps = PrimitivePropsWithRef<'span'> & AvatarFallbackOwnProps;

/**
 * Renders (usually initials, or a generic icon) whenever `AvatarImage`
 * hasn't successfully loaded yet — covers the no-`src`, still-loading, and
 * errored cases alike, so a consumer never needs to branch on *why* the
 * image isn't showing.
 *
 * @example
 * ```tsx
 * <AvatarFallback delayMs={300}>JC</AvatarFallback>
 * ```
 */
const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  (props, forwardedRef) => {
    const { delayMs, ...rest } = props;
    const { imageLoadingStatus } = useAvatarContext(AVATAR_FALLBACK_NAME);
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs === undefined) return;
      const timer = window.setTimeout(() => setCanRender(true), delayMs);
      return () => window.clearTimeout(timer);
    }, [delayMs]);

    if (!canRender || imageLoadingStatus === 'loaded') return null;

    return <Primitive as="span" {...rest} ref={forwardedRef} />;
  },
);

AvatarFallback.displayName = AVATAR_FALLBACK_NAME;

export { AvatarFallback };
export type { AvatarFallbackProps };
