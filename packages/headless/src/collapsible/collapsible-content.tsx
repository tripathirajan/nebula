
import { Presence } from '@nebula/primitives/presence';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import { useCollapsibleContext } from './collapsible-context';

import type { ScopedProps } from './collapsible-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const COLLAPSIBLE_CONTENT_NAME = 'CollapsibleContent';

interface CollapsibleContentProps extends PrimitivePropsWithRef<'div'> {
  /** Keep mounted while collapsed instead of unmounting — same escape hatch as `AccordionContent`/`TabPanel`'s `forceMount`. @default false */
  forceMount?: boolean;
}

/**
 * Wrapped in `@nebula/primitives`' `Presence` (not a plain conditional
 * unmount) so consumers can animate expand/collapse via CSS gated on
 * `data-state="open"|"closed"` — same reasoning `AccordionContent`
 * documents, since this is effectively the single-panel version of it.
 *
 * @example
 * ```tsx
 * <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out">
 *   Extra detail.
 * </CollapsibleContent>
 * ```
 */
const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  ScopedProps<CollapsibleContentProps>
>((props, forwardedRef) => {
  const { __scopeCollapsible, forceMount = false, ...contentProps } = props;
  const context = useCollapsibleContext(COLLAPSIBLE_CONTENT_NAME, __scopeCollapsible);

  return (
    <Presence present={forceMount || context.open}>
      <Primitive
        as="div"
        id={context.contentId}
        data-state={context.open ? 'open' : 'closed'}
        data-disabled={context.disabled ? '' : undefined}
        hidden={!context.open}
        {...contentProps}
        ref={forwardedRef}
      />
    </Presence>
  );
});

CollapsibleContent.displayName = COLLAPSIBLE_CONTENT_NAME;

export { CollapsibleContent };
export type { CollapsibleContentProps };
