import { cn } from '@nebula/primitives/cn';
import { BreadcrumbLink as StylelessBreadcrumbLink } from '@nebula/styleless/breadcrumb';
import * as React from 'react';

import type { BreadcrumbLinkProps as StylelessBreadcrumbLinkProps } from '@nebula/styleless/breadcrumb';

type BreadcrumbLinkProps = StylelessBreadcrumbLinkProps;

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessBreadcrumbLink
        className={cn(
          'transition-colors hover:text-[var(--breadcrumb-link-hover-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

BreadcrumbLink.displayName = 'BreadcrumbLink';

export { BreadcrumbLink };
export type { BreadcrumbLinkProps };
