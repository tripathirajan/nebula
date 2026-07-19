import { BreadcrumbItem as HeadlessBreadcrumbItem } from '@nebula-lab/headless/breadcrumb';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { BreadcrumbItemProps as HeadlessBreadcrumbItemProps } from '@nebula-lab/headless/breadcrumb';

type BreadcrumbItemProps = HeadlessBreadcrumbItemProps;

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessBreadcrumbItem
        className={cn('inline-flex items-center gap-1.5', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export { BreadcrumbItem };
export type { BreadcrumbItemProps };
