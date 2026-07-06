import { createContext } from '@nebula/primitives/create-context-scope';

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
 */
const [AvatarProvider, useAvatarContext] = createContext<AvatarContextValue>(AVATAR_NAME);

export { AVATAR_NAME, AvatarProvider, useAvatarContext };
export type { AvatarContextValue, ImageLoadingStatus };
