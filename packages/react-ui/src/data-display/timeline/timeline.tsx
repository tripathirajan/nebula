import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type TimelineProps = PrimitivePropsWithRef<'ol'>;

/**
 * A vertical sequence of dated/ordered events — purely presentational
 * structure, no matching `@nebula-lab/headless` compound, same treatment
 * `List`/`Stat`/`Card` document (nothing here is a widget with its own ARIA
 * behavior to separate out; it's a real `<ol>` since a timeline's items are
 * inherently ordered, same reasoning `List`'s `ordered` prop exists for).
 * `TimelineItem` draws its own dot + connecting line via a `::before`-free
 * approach (two real elements — a dot `<span>` and a line `<span>` — rather
 * than pseudo-elements, so the line's height can be `100%` of the item's own
 * content height without a fixed-height hack).
 *
 * @example
 * ```tsx
 * <Timeline>
 *   <TimelineItem>
 *     <TimelineTitle>Order placed</TimelineTitle>
 *     <TimelineDescription>Jul 2, 2026</TimelineDescription>
 *   </TimelineItem>
 *   <TimelineItem last>
 *     <TimelineTitle>Delivered</TimelineTitle>
 *   </TimelineItem>
 * </Timeline>
 * ```
 */
const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive as="ol" className={cn('flex flex-col', className)} {...rest} ref={forwardedRef} />
  );
});
Timeline.displayName = 'Timeline';

interface TimelineItemOwnProps {
  /** Omits the connecting line below this item — set on the last item in the sequence so the line doesn't dangle past it. */
  last?: boolean;
}

type TimelineItemProps = PrimitivePropsWithRef<'li'> & TimelineItemOwnProps;

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>((props, forwardedRef) => {
  const { className, last = false, children, ...rest } = props;
  return (
    <Primitive as="li" className={cn('relative flex gap-3 pb-6 last:pb-0', className)} {...rest} ref={forwardedRef}>
      <span className="flex flex-col items-center">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--timeline-dot)]" />
        {last ? null : <span className="w-px flex-1 bg-[var(--timeline-line)]" />}
      </span>
      <div className="flex-1 pb-2">{children}</div>
    </Primitive>
  );
});
TimelineItem.displayName = 'TimelineItem';

type TimelineTitleProps = PrimitivePropsWithRef<'p'>;

const TimelineTitle = React.forwardRef<HTMLParagraphElement, TimelineTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="p"
        className={cn('text-sm font-medium text-[var(--timeline-title-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
TimelineTitle.displayName = 'TimelineTitle';

type TimelineDescriptionProps = PrimitivePropsWithRef<'p'>;

const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="p"
        className={cn('text-sm text-[var(--timeline-description-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
TimelineDescription.displayName = 'TimelineDescription';

export { Timeline, TimelineItem, TimelineTitle, TimelineDescription };
export type { TimelineProps, TimelineItemProps, TimelineTitleProps, TimelineDescriptionProps };
