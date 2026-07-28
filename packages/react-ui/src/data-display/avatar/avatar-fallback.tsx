import { cn } from '@nebula-lab/primitives/cn';
import { AvatarFallback as StylelessAvatarFallback } from '@nebula-lab/styleless/avatar';
import * as React from 'react';

import type { AvatarFallbackProps as StylelessAvatarFallbackProps } from '@nebula-lab/styleless/avatar';

type AvatarFallbackProps = StylelessAvatarFallbackProps;

/**
 * Styled wrapper around `@nebula-lab/styleless`'s `AvatarFallback` — the
 * loading-status check and `delayMs` timer come from there unchanged. This
 * layer adds only the centered-text visual treatment.
 *
 * @example
 * ```tsx
 * <AvatarFallback delayMs={300}>JC</AvatarFallback>
 * ```
 */
const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAvatarFallback
        className={cn(
          'flex h-full w-full items-center justify-center bg-[var(--avatar-bg)] text-[var(--avatar-text)] text-sm font-medium',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AvatarFallback.displayName = 'AvatarFallback';

export { AvatarFallback };
export type { AvatarFallbackProps };
