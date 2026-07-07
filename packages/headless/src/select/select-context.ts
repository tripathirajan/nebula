import { createContextScope } from '@nebula/primitives/create-context-scope';
import { createPopperScope } from '@nebula/primitives/popper';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface SelectContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
  name: string | undefined;
  contentId: string;
  /** Registers `value`'s display label (`SelectItem`'s `textValue`, or its plain-string `children`) so `SelectValue` can look it up without a consumer maintaining a separate label map by hand. */
  registerItemLabel: (value: string, label: string) => void;
  unregisterItemLabel: (value: string) => void;
  getItemLabel: (value: string) => string | undefined;
}

const SELECT_NAME = 'Select';

/**
 * Composes its own scope with `@nebula/primitives`' `Popper` scope, same
 * technique `Popover`'s context uses — one `__scopeSelect` prop threads
 * through to both `Select`'s own context and the `Popper` positioning
 * context `SelectTrigger`/`SelectContent` are built on.
 */
const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();
const [SelectProvider, useSelectContext] = createSelectContext<SelectContextValue>(SELECT_NAME);

/** Every consumer prop object accepts an optional internal `__scopeSelect` prop threaded through by `createSelectScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeSelect?: Scope<SelectContextValue> };

export { SELECT_NAME, SelectProvider, useSelectContext, createSelectScope, usePopperScope };
export type { SelectContextValue, ScopedProps };
