import { StepperList as HeadlessStepperList } from '@nebula-lab/headless/stepper';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { StepperListProps as HeadlessStepperListProps } from '@nebula-lab/headless/stepper';

type StepperListProps = HeadlessStepperListProps;

/** Lays steps out in a row (or column, via `data-[orientation=vertical]`) with even gaps. */
const StepperList = React.forwardRef<HTMLOListElement, StepperListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessStepperList
        className={cn(
          'flex items-start gap-2 data-[orientation=vertical]:flex-col',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

StepperList.displayName = 'StepperList';

export { StepperList };
export type { StepperListProps };
