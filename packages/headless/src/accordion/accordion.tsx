
import { useControllableState, useId } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import { RovingFocusGroup } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';


import { AccordionProvider } from './accordion-context';

import type { ScopedProps } from './accordion-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { RovingFocusGroupOrientation } from '@nebula/primitives/roving-focus-group';

interface AccordionSharedProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  /** @default 'vertical' */
  orientation?: RovingFocusGroupOrientation;
  /** Arrow keys wrap from the last header back to the first. @default true */
  loop?: boolean;
}

interface AccordionSingleProps extends AccordionSharedProps {
  type: 'single';
  /** Controlled: the currently expanded item's value, or `undefined` if none is. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /** If `false` (default), clicking the currently-open item's trigger does nothing — exactly one item stays expanded once any has been opened. If `true`, it collapses, leaving none open. */
  collapsible?: boolean;
}

interface AccordionMultipleProps extends AccordionSharedProps {
  type: 'multiple';
  /** Controlled: the set of currently expanded items' values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/**
 * Discriminated on `type`: `"single"` allows at most one item open at a time
 * (`value`/`onValueChange` are a single string), `"multiple"` allows any
 * number open independently (`value`/`onValueChange` are a string array) —
 * matching the WAI-ARIA Accordion pattern's two accepted behaviors rather
 * than picking one.
 */
type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

const ACCORDION_NAME = 'Accordion';

/**
 * Root of the Accordion compound component. Delegates to one of two internal
 * implementations based on `type` (`AccordionImplSingle`/`AccordionImplMultiple`)
 * so each can call `useControllableState` with its own value shape without
 * conditionally calling hooks — both funnel into the shared `AccordionImpl`
 * for the actual rendering + roving-tabindex wiring.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionHeader>
 *       <AccordionTrigger>What is nebula?</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionContent>A composable React UI platform.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const Accordion = React.forwardRef<HTMLDivElement, ScopedProps<AccordionProps>>(
  (props, forwardedRef) => {
    if (props.type === 'multiple') {
      return <AccordionImplMultiple {...props} ref={forwardedRef} />;
    }
    return <AccordionImplSingle {...props} ref={forwardedRef} />;
  },
);

Accordion.displayName = ACCORDION_NAME;

const AccordionImplSingle = React.forwardRef<HTMLDivElement, ScopedProps<AccordionSingleProps>>(
  (props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      collapsible = false,
      type: _type,
      ...implProps
    } = props;

    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <AccordionImpl
        {...implProps}
        ref={forwardedRef}
        isItemOpen={(itemValue) => itemValue === value}
        onItemOpenChange={(itemValue, open) => {
          if (open) {
            setValue(itemValue);
          } else if (collapsible) {
            setValue((current) => (current === itemValue ? undefined : current));
          }
        }}
      />
    );
  },
);

AccordionImplSingle.displayName = 'AccordionImplSingle';

const AccordionImplMultiple = React.forwardRef<HTMLDivElement, ScopedProps<AccordionMultipleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
    });

    return (
      <AccordionImpl
        {...implProps}
        ref={forwardedRef}
        isItemOpen={(itemValue) => (value ?? []).includes(itemValue)}
        onItemOpenChange={(itemValue, open) => {
          setValue((current) => {
            const currentValues = current ?? [];
            return open
              ? [...currentValues, itemValue]
              : currentValues.filter((v) => v !== itemValue);
          });
        }}
      />
    );
  },
);

AccordionImplMultiple.displayName = 'AccordionImplMultiple';

interface AccordionImplProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  orientation?: RovingFocusGroupOrientation;
  loop?: boolean;
  isItemOpen: (value: string) => boolean;
  onItemOpenChange: (value: string, open: boolean) => void;
}

const AccordionImpl = React.forwardRef<HTMLDivElement, ScopedProps<AccordionImplProps>>(
  (props, forwardedRef) => {
    const {
      __scopeAccordion,
      disabled = false,
      orientation = 'vertical',
      loop = true,
      isItemOpen,
      onItemOpenChange,
      ...groupProps
    } = props;

    const baseId = useId('nebula-accordion');

    return (
      <AccordionProvider
        scope={__scopeAccordion}
        baseId={baseId}
        isItemOpen={isItemOpen}
        onItemOpenChange={onItemOpenChange}
        disabled={disabled}
        orientation={orientation}
      >
        <RovingFocusGroup asChild orientation={orientation} loop={loop}>
          <Primitive
            as="div"
            data-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup>
      </AccordionProvider>
    );
  },
);

AccordionImpl.displayName = 'AccordionImpl';

export { Accordion };
export type { AccordionProps, AccordionSingleProps, AccordionMultipleProps };
