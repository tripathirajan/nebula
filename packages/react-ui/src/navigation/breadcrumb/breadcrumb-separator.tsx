import { BreadcrumbSeparator as HeadlessBreadcrumbSeparator } from '@nebula-lab/headless/breadcrumb';
import * as React from 'react';

import type { BreadcrumbSeparatorProps as HeadlessBreadcrumbSeparatorProps } from '@nebula-lab/headless/breadcrumb';

type BreadcrumbSeparatorProps = HeadlessBreadcrumbSeparatorProps;

/** Defaults to a chevron icon when no `children` is given — a consumer can still pass e.g. `"/"` or their own icon instead. */
const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  (props, forwardedRef) => {
    const { children, ...rest } = props;
    return (
      <HeadlessBreadcrumbSeparator {...rest} ref={forwardedRef}>
        {children ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 text-[var(--breadcrumb-text)]/50"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </HeadlessBreadcrumbSeparator>
    );
  },
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export { BreadcrumbSeparator };
export type { BreadcrumbSeparatorProps };
