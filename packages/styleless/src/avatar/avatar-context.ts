import { createContext } from '@nebula-lab/primitives/create-context-scope';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface AvatarContextValue {
  imageLoadingStatus: ImageLoadingStatus;
  onImageLoadingStatusChange: (status: ImageLoadingStatus) => void;
}

const AVATAR_NAME = 'Avatar';

/**
 * Plain (non-scoped) context is enough here — unlike `Accordion`/`Dialog`,
 * nested `Avatar`s (an avatar inside another avatar's fallback, say) aren't
 * a real scenario worth the scoped-context machinery for.
 *
 * Moved down from `react-ui` this session: this state machine (image
 * load/error tracking so a fallback knows when to show itself) is reusable
 * non-visual behavior with no opinionated styling of its own — same bucket
 * `PasswordInput`'s visibility toggle and `ImagePreview`'s object-URL
 * lifecycle already live in, not a full WAI-ARIA widget pattern (that's
 * what distinguishes it from `Progress`/`Spinner`/`Skeleton`, which stayed
 * in `@nebula-lab/headless` since they carry a real ARIA role).
 */
const [AvatarProvider, useAvatarContext] = createContext<AvatarContextValue>(AVATAR_NAME);

export { AVATAR_NAME, AvatarProvider, useAvatarContext };
export type { AvatarContextValue, ImageLoadingStatus };
