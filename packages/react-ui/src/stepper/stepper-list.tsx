import { cn } from '@nebula/primitives/cn';
import { StepperList as StylelessStepperList } from '@nebula/styleless/stepper';
import * as React from 'react';

import type { StepperListProps as StylelessStepperListProps } from '@nebula/styleless/stepper';

type StepperListProps = StylelessStepperListProps;

/** Lays steps out in a row (or column, via `data-[orientation=vertical]`) with even gaps. */
const StepperList = React.forwardRef<HTMLOListElement, StepperListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessStepperList
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
