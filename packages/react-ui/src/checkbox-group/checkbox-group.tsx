import { cn } from '@nebula/primitives/cn';
import { CheckboxGroup as StylelessCheckboxGroup } from '@nebula/styleless/checkbox-group';
import * as React from 'react';

import type { CheckboxGroupProps as StylelessCheckboxGroupProps } from '@nebula/styleless/checkbox-group';

type CheckboxGroupProps = StylelessCheckboxGroupProps;

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessCheckboxGroup
        className={cn('flex flex-col gap-2', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup };
export type { CheckboxGroupProps };
