import { cn } from '@nebula/primitives/cn';
import { BreadcrumbPage as StylelessBreadcrumbPage } from '@nebula/styleless/breadcrumb';
import * as React from 'react';

import type { BreadcrumbPageProps as StylelessBreadcrumbPageProps } from '@nebula/styleless/breadcrumb';

type BreadcrumbPageProps = StylelessBreadcrumbPageProps;

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessBreadcrumbPage
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
