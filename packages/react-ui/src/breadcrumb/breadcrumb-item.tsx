import { cn } from '@nebula/primitives/cn';
import { BreadcrumbItem as StylelessBreadcrumbItem } from '@nebula/styleless/breadcrumb';
import * as React from 'react';

import type { BreadcrumbItemProps as StylelessBreadcrumbItemProps } from '@nebula/styleless/breadcrumb';

type BreadcrumbItemProps = StylelessBreadcrumbItemProps;

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessBreadcrumbItem
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
