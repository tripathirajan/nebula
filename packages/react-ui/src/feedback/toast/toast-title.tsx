import { ToastTitle as HeadlessToastTitle } from '@nebula-lab/headless/toast';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { ToastTitleProps as HeadlessToastTitleProps } from '@nebula-lab/headless/toast';

type ToastTitleProps = HeadlessToastTitleProps;

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessToastTitle className={cn('font-semibold', className)} {...rest} ref={forwardedRef} />
  );
});

ToastTitle.displayName = 'ToastTitle';

export { ToastTitle };
export type { ToastTitleProps };
