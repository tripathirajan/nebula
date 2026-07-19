import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { usePaginationContext } from './pagination-context';

import type { ScopedProps } from './pagination-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const PAGINATION_LINK_NAME = 'PaginationLink';

interface PaginationLinkProps extends PrimitivePropsWithRef<'button'> {
  /** The page number this link navigates to. */
  page: number;
}

/**
 * One page number — a `<button>` by default (`asChild` a real `<a href>` if
 * pages are separate URLs, e.g. `?page=3`, which is the more common real-app
 * shape for pagination; a `<button>` alone doesn't get you shareable/
 * bookmarkable URLs). `aria-current="page"` marks the active one, per the
 * WAI-ARIA Authoring Practices' pagination guidance.
 *
 * @example
 * ```tsx
 * <PaginationLink page={3}>3</PaginationLink>
 * <PaginationLink asChild page={3}><a href="?page=3">3</a></PaginationLink>
 * ```
 */
const PaginationLink = React.forwardRef<HTMLButtonElement, ScopedProps<PaginationLinkProps>>(
  (props, forwardedRef) => {
    const { __scopePagination, page, onClick, disabled: disabledProp, ...linkProps } = props;
    const context = usePaginationContext(PAGINATION_LINK_NAME, __scopePagination);
    const disabled = disabledProp || context.disabled;
    const active = context.page === page;

    return (
      <Primitive
        as="button"
        type="button"
        aria-current={active ? 'page' : undefined}
        aria-label={`Page ${page}`}
        data-state={active ? 'active' : 'inactive'}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        {...linkProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) context.onPageChange(page);
        })}
      />
    );
  },
);

PaginationLink.displayName = PAGINATION_LINK_NAME;

export { PaginationLink };
export type { PaginationLinkProps };
