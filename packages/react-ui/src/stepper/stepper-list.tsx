import { StepperList as HeadlessStepperList } from '@nebula/headless/stepper';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { StepperListProps as HeadlessStepperListProps } from '@nebula/headless/stepper';

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
