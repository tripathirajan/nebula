import { Listbox } from '@nebula-lab/headless/listbox';
import { PopoverContent as HeadlessPopoverContent } from '@nebula-lab/headless/popover';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { useMultiSelectContext } from './multi-select-context';

import type { PopoverContentProps as HeadlessPopoverContentProps } from '@nebula-lab/headless/popover';

type MultiSelectContentProps = HeadlessPopoverContentProps;

/**
 * The popup panel — a `PopoverContent` (this package's own `--popover-*`
 * surface treatment) with a `@nebula-lab/headless` `Listbox` (`type="multiple"`)
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
      <HeadlessPopoverContent
        className={cn(
          'z-[var(--z-overlay)] max-h-72 min-w-40 overflow-y-auto rounded-[var(--radius-popover)] border border-[var(--multi-select-content-border)] bg-[var(--multi-select-content-bg)] p-1 text-[var(--multi-select-text)] shadow-[var(--elevation-anchored)] focus-visible:outline-none',
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
      </HeadlessPopoverContent>
    );
  },
);

MultiSelectContent.displayName = 'MultiSelectContent';

export { MultiSelectContent };
export type { MultiSelectContentProps };
