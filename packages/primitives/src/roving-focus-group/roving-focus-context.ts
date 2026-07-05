import { createContextScope } from '../create-context-scope/create-context-scope';

import type { Scope } from '../create-context-scope/create-context-scope';

type Orientation = 'horizontal' | 'vertical';

interface RovingFocusGroupContextValue {
  orientation: Orientation;
  loop: boolean;
  currentTabStopId: string | null;
  onItemFocus: (id: string) => void;
  onItemShiftTab: () => void;
  getItems: () => Array<{ id: string; node: HTMLElement }>;
  /** Registers an item's DOM node under `id`; returns an unregister cleanup. */
  registerItem: (id: string, node: HTMLElement) => () => void;
}

const ROVING_FOCUS_GROUP_NAME = 'RovingFocusGroup';

const [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  ROVING_FOCUS_GROUP_NAME,
);
const [RovingFocusGroupProvider, useRovingFocusGroupContext] =
  createRovingFocusGroupContext<RovingFocusGroupContextValue>(ROVING_FOCUS_GROUP_NAME);

/** Every `RovingFocusGroup`/`FocusItem` prop object accepts an internal `__scopeRovingFocusGroup`, threaded through by `createRovingFocusGroupScope`. */
type ScopedProps<P> = P & { __scopeRovingFocusGroup?: Scope<RovingFocusGroupContextValue> };

export {
  ROVING_FOCUS_GROUP_NAME,
  RovingFocusGroupProvider,
  useRovingFocusGroupContext,
  createRovingFocusGroupScope,
};
export type { RovingFocusGroupContextValue, Orientation, ScopedProps };
