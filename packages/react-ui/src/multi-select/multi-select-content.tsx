import { cn } from '@nebula/primitives/cn';
import { Listbox } from '@nebula/styleless/listbox';
import { PopoverContent as StylelessPopoverContent } from '@nebula/styleless/popover';
import * as React from 'react';

import { useMultiSelectContext } from './multi-select-context';

import type { PopoverContentProps as StylelessPopoverContentProps } from '@nebula/styleless/popover';

type MultiSelectContentProps = StylelessPopoverContentProps;

/**
 * The popup panel — a `PopoverContent` (this package's own `--popover-*`
 * surface treatment) with a `@nebula/styleless` `Listbox` (`type="multiple"`)
 * rendered directly inside it as the one child, rather than two visually
 * distinct layers. The `Listbox`'s `value`/`onValueChange` are wired
 * straight to `MultiSelect`'s own context state — this component owns no
 * state of its own, it's purely the composition point between `Popover`'s
 * positioning and `Listbox`'s selection behavior.
 */
const MultiSelectContent = React.forwardRef<HTMLDivElement, MultiSelectContentProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    const context = useMultiSelectContext('MultiSelectContent');

    return (
      <StylelessPopoverContent
        className={cn(
          'z-50 max-h-72 min-w-40 overflow-y-auto rounded-[var(--radius-popover)] border border-[var(--multi-select-content-border)] bg-[var(--multi-select-content-bg)] p-1 text-[var(--multi-select-text)] shadow-md focus-visible:outline-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <Listbox
          type="multiple"
          value={context.value}
          onValueChange={context.setValue}
          disabled={context.disabled}
          aria-label="Options"
        >
          {children}
        </Listbox>
      </StylelessPopoverContent>
    );
  },
);

MultiSelectContent.displayName = 'MultiSelectContent';

export { MultiSelectContent };
export type { MultiSelectContentProps };
