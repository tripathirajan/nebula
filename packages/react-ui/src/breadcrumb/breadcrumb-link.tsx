import { BreadcrumbLink as HeadlessBreadcrumbLink } from '@nebula/headless/breadcrumb';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { BreadcrumbLinkProps as HeadlessBreadcrumbLinkProps } from '@nebula/headless/breadcrumb';

type BreadcrumbLinkProps = HeadlessBreadcrumbLinkProps;

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessBreadcrumbLink
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
