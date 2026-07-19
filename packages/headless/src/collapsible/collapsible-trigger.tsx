
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useCollapsibleContext } from './collapsible-context';

import type { ScopedProps } from './collapsible-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COLLAPSIBLE_TRIGGER_NAME = 'CollapsibleTrigger';

type CollapsibleTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * `aria-expanded`/`aria-controls` wired to `CollapsibleContent`'s `id`, same
 * disclosure pattern `AccordionTrigger` follows — native `<button>` gives
 * correct keyboard/click activation for free, so unlike `AccordionTrigger`
 * this doesn't need `FocusItem`/roving-tabindex at all: a standalone
 * `Collapsible` isn't one of several siblings sharing arrow-key navigation
 * the way an accordion's triggers are.
 *
 * @example
 * ```tsx
 * <CollapsibleTrigger>Show more</CollapsibleTrigger>
 * ```
 */
const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<CollapsibleTriggerProps>
>((props, forwardedRef) => {
  const { __scopeCollapsible, onClick, disabled: disabledProp, ...triggerProps } = props;
  const context = useCollapsibleContext(COLLAPSIBLE_TRIGGER_NAME, __scopeCollapsible);
  const disabled = disabledProp || context.disabled;

  return (
    <Primitive
      as="button"
      type="button"
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-state={context.open ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      {...triggerProps}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, context.onOpenToggle)}
    />
  );
});

CollapsibleTrigger.displayName = COLLAPSIBLE_TRIGGER_NAME;

export { CollapsibleTrigger };
export type { CollapsibleTriggerProps };
