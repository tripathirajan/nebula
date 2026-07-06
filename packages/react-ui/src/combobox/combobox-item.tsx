import { cn } from '@nebula/primitives/cn';
import { ComboboxItem as StylelessComboboxItem } from '@nebula/styleless/combobox';
import * as React from 'react';

import type { ComboboxItemProps as StylelessComboboxItemProps } from '@nebula/styleless/combobox';

type ComboboxItemProps = StylelessComboboxItemProps;

/** `data-highlighted` (virtual, via `aria-activedescendant` — see the styleless source) drives the fill, same "state attribute, not real focus" pattern `Command`'s items use, since real focus always stays on `ComboboxInput` here too. */
const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessComboboxItem
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
