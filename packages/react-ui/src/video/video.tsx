import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type VideoProps = PrimitivePropsWithRef<'video'>;

/**
 * A themed `<video>` — purely presentational (rounded, clipped corners),
 * no custom player chrome of its own; native browser `controls` are shown
 * by default (pass `controls={false}` to drive playback entirely yourself).
 * No `@nebula/primitives`/`@nebula/headless` layer underneath — a native
 * `<video controls>` already has full keyboard/screen-reader operability
 * for free, same "nothing to decouple" reasoning `SearchField`'s native
 * `type="search"` affordances document.
 *
 * @example
 * ```tsx
 * <Video src="/demo.mp4" controls className="w-full max-w-2xl" />
 * ```
 */
const Video = React.forwardRef<HTMLVideoElement, VideoProps>((props, forwardedRef) => {
  const { className, controls = true, ...rest } = props;
  return (
    <Primitive
      as="video"
      controls={controls}
      className={cn('rounded-[var(--radius-box)] bg-black', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Video.displayName = 'Video';

export { Video };
export type { VideoProps };
