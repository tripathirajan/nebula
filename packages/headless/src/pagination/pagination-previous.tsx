import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { usePaginationContext } from './pagination-context';

import type { ScopedProps } from './pagination-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const PAGINATION_PREVIOUS_NAME = 'PaginationPrevious';

type PaginationPreviousProps = PrimitivePropsWithRef<'button'>;

/**
 * Moves to `page - 1` — disabled automatically on the first page.
 *
 * @example
 * ```tsx
 * <PaginationPrevious />
 * ```
 */
const PaginationPrevious = React.forwardRef<HTMLButtonElement, ScopedProps<PaginationPreviousProps>>(
  (props, forwardedRef) => {
    const { __scopePagination, onClick, disabled: disabledProp, children, ...rest } = props;
    const context = usePaginationContext(PAGINATION_PREVIOUS_NAME, __scopePagination);
    const disabled = disabledProp || context.disabled || context.page <= 1;

    return (
      <Primitive
        as="button"
        type="button"
        aria-label="Previous page"
        disabled={disabled}
        {...rest}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) context.onPageChange(context.page - 1);
        })}
      >
        {children ?? 'Previous'}
      </Primitive>
    );
  },
);

PaginationPrevious.displayName = PAGINATION_PREVIOUS_NAME;

export { PaginationPrevious };
export type { PaginationPreviousProps };
