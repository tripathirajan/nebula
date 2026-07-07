import { CheckboxGroup as HeadlessCheckboxGroup } from '@nebula/headless/checkbox-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CheckboxGroupProps as HeadlessCheckboxGroupProps } from '@nebula/headless/checkbox-group';

type CheckboxGroupProps = HeadlessCheckboxGroupProps;

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCheckboxGroup
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
