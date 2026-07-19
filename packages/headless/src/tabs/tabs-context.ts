import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

type Orientation = 'horizontal' | 'vertical';
type ActivationMode = 'automatic' | 'manual';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  orientation: Orientation;
  activationMode: ActivationMode;
}

const TABS_NAME = 'Tabs';

/**
 * Scoped context factory for Tabs — lets a `Tabs` nested inside another
 * `Tabs` mint its own context instead of colliding with the outer one (see
 * `@nebula-lab/primitives/create-context-scope`).
 */
const [createTabsContext, createTabsScope] = createContextScope(TABS_NAME);
const [TabsProvider, useTabsContext] = createTabsContext<TabsContextValue>(TABS_NAME);

/** Every consumer prop object accepts an optional internal `__scopeTabs` prop
 * threaded through by `createTabsScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeTabs?: Scope<TabsContextValue> };

/**
 * Derives a stable, unique `id` for the `Tab` trigger controlling `value`,
 * used to wire up `aria-controls`/`id` between `Tab` and `TabPanel`.
 *
 * @param baseId - The `Tabs` instance's generated base id.
 * @param value - The tab's `value`.
 * @returns The trigger element's `id`.
 *
 * @example
 * ```ts
 * makeTriggerId('nebula-tabs-1', 'account'); // 'nebula-tabs-1-trigger-account'
 * ```
 */
function makeTriggerId(baseId: string, value: string): string {
  return `${baseId}-trigger-${value}`;
}

/**
 * Derives a stable, unique `id` for the `TabPanel` corresponding to `value`,
 * used to wire up `aria-labelledby`/`id` between `Tab` and `TabPanel`.
 *
 * @param baseId - The `Tabs` instance's generated base id.
 * @param value - The tab's `value`.
 * @returns The panel element's `id`.
 *
 * @example
 * ```ts
 * makeContentId('nebula-tabs-1', 'account'); // 'nebula-tabs-1-content-account'
 * ```
 */
function makeContentId(baseId: string, value: string): string {
  return `${baseId}-content-${value}`;
}

export { TABS_NAME, TabsProvider, useTabsContext, createTabsScope, makeTriggerId, makeContentId };
export type { TabsContextValue, Orientation, ActivationMode, ScopedProps };
