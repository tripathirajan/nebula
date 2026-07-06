import { cn } from '@nebula/primitives/cn';
import { BreadcrumbList as StylelessBreadcrumbList } from '@nebula/styleless/breadcrumb';
import * as React from 'react';

import type { BreadcrumbListProps as StylelessBreadcrumbListProps } from '@nebula/styleless/breadcrumb';

type BreadcrumbListProps = StylelessBreadcrumbListProps;

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessBreadcrumbList
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
