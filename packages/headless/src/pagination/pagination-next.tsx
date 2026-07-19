import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { usePaginationContext } from './pagination-context';

import type { ScopedProps } from './pagination-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const PAGINATION_NEXT_NAME = 'PaginationNext';

type PaginationNextProps = PrimitivePropsWithRef<'button'>;

/**
 * Moves to `page + 1` — disabled automatically on the last page.
 *
 * @example
 * ```tsx
 * <PaginationNext />
 * ```
 */
const PaginationNext = React.forwardRef<HTMLButtonElement, ScopedProps<PaginationNextProps>>(
  (props, forwardedRef) => {
    const { __scopePagination, onClick, disabled: disabledProp, children, ...rest } = props;
    const context = usePaginationContext(PAGINATION_NEXT_NAME, __scopePagination);
    const disabled = disabledProp || context.disabled || context.page >= context.pageCount;

    return (
      <Primitive
        as="button"
        type="button"
        aria-label="Next page"
        disabled={disabled}
        {...rest}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) context.onPageChange(context.page + 1);
        })}
      >
        {children ?? 'Next'}
      </Primitive>
    );
  },
);

PaginationNext.displayName = PAGINATION_NEXT_NAME;

export { PaginationNext };
export type { PaginationNextProps };
