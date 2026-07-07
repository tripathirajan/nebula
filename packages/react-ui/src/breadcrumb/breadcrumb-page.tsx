import { BreadcrumbPage as HeadlessBreadcrumbPage } from '@nebula/headless/breadcrumb';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { BreadcrumbPageProps as HeadlessBreadcrumbPageProps } from '@nebula/headless/breadcrumb';

type BreadcrumbPageProps = HeadlessBreadcrumbPageProps;

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessBreadcrumbPage
        className={cn('font-medium text-[var(--breadcrumb-current-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

export { BreadcrumbPage };
export type { BreadcrumbPageProps };
