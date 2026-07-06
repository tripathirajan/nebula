import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type AudioProps = PrimitivePropsWithRef<'audio'>;

/** A themed `<audio>` — same "just adds rounding, native controls stay in charge" treatment as `Video`. */
const Audio = React.forwardRef<HTMLAudioElement, AudioProps>((props, forwardedRef) => {
  const { className, controls = true, ...rest } = props;
  return (
    <Primitive
      as="audio"
      controls={controls}
      className={cn('w-full rounded-[var(--radius-box)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Audio.displayName = 'Audio';

export { Audio };
export type { AudioProps };
