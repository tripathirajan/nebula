import { cn } from '@nebula/primitives/cn';
import { ToastTitle as StylelessToastTitle } from '@nebula/styleless/toast';
import * as React from 'react';

import type { ToastTitleProps as StylelessToastTitleProps } from '@nebula/styleless/toast';

type ToastTitleProps = StylelessToastTitleProps;

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessToastTitle className={cn('font-semibold', className)} {...rest} ref={forwardedRef} />
  );
});

ToastTitle.displayName = 'ToastTitle';

export { ToastTitle };
export type { ToastTitleProps };
