import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Whether Tab/Shift+Tab is trapped within `DialogContent` and the rest of the page is inert to pointer/outside-click dismissal. @default true */
  modal: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
  /** Ids of currently-mounted `DialogDescription` instances (in practice 0 or 1) — see `Dialog`'s own doc comment for why `DialogContent`'s `aria-describedby` is built from this instead of `descriptionId` unconditionally. Shared by `AlertDialogContent`/`DrawerContent`, which reuse this same context. */
  describedByIds: string[];
  registerDescribedBy: (id: string) => void;
  unregisterDescribedBy: (id: string) => void;
}

const DIALOG_NAME = 'Dialog';

/**
 * Scoped context factory for Dialog — mirrors `Tabs`/`RadioGroup`/`Accordion`'s
 * use of `createContextScope` so a `Dialog` nested inside another one (e.g. a
 * confirm dialog opened from within a bigger dialog) mints its own context.
 */
const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME);

/** Every consumer prop object accepts an optional internal `__scopeDialog` prop threaded through by `createDialogScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeDialog?: Scope<DialogContextValue> };

export { DIALOG_NAME, DialogProvider, useDialogContext, createDialogScope };
export type { DialogContextValue, ScopedProps };
