import { ComboboxItem as HeadlessComboboxItem } from '@nebula/headless/combobox';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ComboboxItemProps as HeadlessComboboxItemProps } from '@nebula/headless/combobox';

type ComboboxItemProps = HeadlessComboboxItemProps;

/** `data-highlighted` (virtual, via `aria-activedescendant` — see the headless source) drives the fill, same "state attribute, not real focus" pattern `Command`'s items use, since real focus always stays on `ComboboxInput` here too. */
const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessComboboxItem
      className={cn(
        'flex cursor-pointer items-center rounded-[var(--radius-selector)] px-3 py-1.5 text-sm data-[highlighted]:bg-[var(--combobox-item-highlighted-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

ComboboxItem.displayName = 'ComboboxItem';

export { ComboboxItem };
export type { ComboboxItemProps };
