import { BreadcrumbList as HeadlessBreadcrumbList } from '@nebula-lab/headless/breadcrumb';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { BreadcrumbListProps as HeadlessBreadcrumbListProps } from '@nebula-lab/headless/breadcrumb';

type BreadcrumbListProps = HeadlessBreadcrumbListProps;

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessBreadcrumbList
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-sm text-[var(--breadcrumb-text)] sm:gap-2.5',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

BreadcrumbList.displayName = 'BreadcrumbList';

export { BreadcrumbList };
export type { BreadcrumbListProps };
