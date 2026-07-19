
import { useControllableState } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { RovingFocusGroup } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';


import { ToggleGroupProvider } from './toggle-group-context';

import type { ScopedProps } from './toggle-group-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';
import type { RovingFocusGroupOrientation } from '@nebula-lab/primitives/roving-focus-group';

interface ToggleGroupSharedProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  /** @default 'horizontal' */
  orientation?: RovingFocusGroupOrientation;
  /** Arrow keys wrap from the last item back to the first. @default true */
  loop?: boolean;
}

interface ToggleGroupSingleProps extends ToggleGroupSharedProps {
  type: 'single';
  /** Controlled: the currently pressed item's value, or `undefined` if none is. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
}

interface ToggleGroupMultipleProps extends ToggleGroupSharedProps {
  type: 'multiple';
  /** Controlled: the set of currently pressed items' values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/**
 * Discriminated on `type`: `"single"` allows at most one item pressed at a
 * time (`value`/`onValueChange` are a single string — a segmented control,
 * e.g. text alignment: left/center/right), `"multiple"` allows any number
 * pressed independently (`value`/`onValueChange` are a string array — a
 * toolbar, e.g. bold/italic/underline). Same split `Accordion`'s
 * `type="single" | "multiple"` uses, for the same reason.
 */
type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const TOGGLE_GROUP_NAME = 'ToggleGroup';

/**
 * Root of the ToggleGroup compound component — a set of {@link Toggle}
 * buttons (`role="group"`, not `radiogroup`: this is a group of toggle
 * buttons per the WAI-ARIA Button pattern, not the Radio Group pattern, even
 * in `type="single"` mode — matching how a real text-alignment toolbar is
 * exposed). Delegates to one of two internal implementations based on
 * `type`, same reasoning as `Accordion`'s `AccordionImplSingle`/
 * `AccordionImplMultiple` split (each calls `useControllableState` with its
 * own value shape without conditionally calling hooks).
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
 *   <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
 *   <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
 *   <ToggleGroupItem value="right" aria-label="Right">R</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */
const ToggleGroup = React.forwardRef<HTMLDivElement, ScopedProps<ToggleGroupProps>>(
  (props, forwardedRef) => {
    if (props.type === 'multiple') {
      return <ToggleGroupImplMultiple {...props} ref={forwardedRef} />;
    }
    return <ToggleGroupImplSingle {...props} ref={forwardedRef} />;
  },
);

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

const ToggleGroupImplSingle = React.forwardRef<HTMLDivElement, ScopedProps<ToggleGroupSingleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <ToggleGroupImpl
        {...implProps}
        ref={forwardedRef}
        isItemPressed={(itemValue) => itemValue === value}
        onItemPressedChange={(itemValue, pressed) => {
          // Single-select: pressing an item selects it; there's no
          // "collapsible" escape hatch like Accordion's — a segmented
          // control always has exactly one segment active once any has
          // been pressed (clicking the already-pressed item is a no-op,
          // matching how native radio buttons behave).
          if (pressed) setValue(itemValue);
        }}
      />
    );
  },
);

ToggleGroupImplSingle.displayName = 'ToggleGroupImplSingle';

const ToggleGroupImplMultiple = React.forwardRef<
  HTMLDivElement,
  ScopedProps<ToggleGroupMultipleProps>
>((props, forwardedRef) => {
  const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

  const [value, setValue] = useControllableState<string[]>({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  });

  return (
    <ToggleGroupImpl
      {...implProps}
      ref={forwardedRef}
      isItemPressed={(itemValue) => (value ?? []).includes(itemValue)}
      onItemPressedChange={(itemValue, pressed) => {
        setValue((current) => {
          const currentValues = current ?? [];
          return pressed
            ? [...currentValues, itemValue]
            : currentValues.filter((v) => v !== itemValue);
        });
      }}
    />
  );
});

ToggleGroupImplMultiple.displayName = 'ToggleGroupImplMultiple';

interface ToggleGroupImplProps extends PrimitivePropsWithRef<'div'> {
  disabled?: boolean;
  orientation?: RovingFocusGroupOrientation;
  loop?: boolean;
  isItemPressed: (value: string) => boolean;
  onItemPressedChange: (value: string, pressed: boolean) => void;
}

const ToggleGroupImpl = React.forwardRef<HTMLDivElement, ScopedProps<ToggleGroupImplProps>>(
  (props, forwardedRef) => {
    const {
      __scopeToggleGroup,
      disabled = false,
      orientation = 'horizontal',
      loop = true,
      isItemPressed,
      onItemPressedChange,
      ...groupProps
    } = props;

    return (
      <ToggleGroupProvider
        scope={__scopeToggleGroup}
        isItemPressed={isItemPressed}
        onItemPressedChange={onItemPressedChange}
        disabled={disabled}
        orientation={orientation}
      >
        <RovingFocusGroup asChild orientation={orientation} loop={loop}>
          <Primitive
            as="div"
            role="group"
            data-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup>
      </ToggleGroupProvider>
    );
  },
);

ToggleGroupImpl.displayName = 'ToggleGroupImpl';

export { ToggleGroup };
export type { ToggleGroupProps, ToggleGroupSingleProps, ToggleGroupMultipleProps };
