import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface RatingContextValue {
  value: number | undefined;
  onValueChange: (value: number) => void;
  /** The value being previewed via pointer hover, distinct from the committed `value` — `undefined` when nothing is being hovered, in which case every `RatingItem` falls back to comparing against `value` instead. */
  hoveredValue: number | undefined;
  setHoveredValue: (value: number | undefined) => void;
  disabled: boolean;
  required: boolean;
  name: string | undefined;
}

const RATING_NAME = 'Rating';

/**
 * Scoped context factory for Rating — structurally close to `RadioGroup`'s
 * context (single-select, `value`/`onValueChange`) plus one addition
 * (`hoveredValue`) `RadioGroup` has no equivalent of, which is why this is
 * its own context rather than reusing `RadioGroup`'s directly (unlike
 * `AlertDialog` reusing `Dialog`'s context as-is, there's a real shape
 * difference here).
 */
const [createRatingContext, createRatingScope] = createContextScope(RATING_NAME);
const [RatingProvider, useRatingContext] = createRatingContext<RatingContextValue>(RATING_NAME);

/** Every consumer prop object accepts an optional internal `__scopeRating` prop threaded through by `createRatingScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeRating?: Scope<RatingContextValue> };

export { RATING_NAME, RatingProvider, useRatingContext, createRatingScope };
export type { RatingContextValue, ScopedProps };
