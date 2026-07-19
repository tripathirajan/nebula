import { CheckboxGroup as HeadlessCheckboxGroup } from '@nebula-lab/headless/checkbox-group';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CheckboxGroupProps as HeadlessCheckboxGroupProps } from '@nebula-lab/headless/checkbox-group';

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
