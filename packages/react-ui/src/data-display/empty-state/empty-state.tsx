import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type EmptyStateProps = PrimitivePropsWithRef<'div'>;

/**
 * A placeholder for an empty list/search-result/inbox — `EmptyStateIcon`/
 * `EmptyStateTitle`/`EmptyStateDescription`/`EmptyStateAction` are purely
 * presentational structure, same "no matching `@nebula-lab/headless` or
 * `@nebula-lab/styleless` compound" treatment `Card`/`Stat`/`Timeline` already
 * document (nothing here is a widget with its own behavior to separate
 * out — it's a themed, centered column, not a state machine).
 *
 * @example
 * ```tsx
 * <EmptyState>
 *   <EmptyStateIcon><InboxIcon /></EmptyStateIcon>
 *   <EmptyStateTitle>No messages yet</EmptyStateTitle>
 *   <EmptyStateDescription>New messages will show up here.</EmptyStateDescription>
 *   <EmptyStateAction><Button>Compose</Button></EmptyStateAction>
 * </EmptyState>
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn('flex flex-col items-center gap-2 py-12 text-center', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
EmptyState.displayName = 'EmptyState';

type EmptyStateIconProps = PrimitivePropsWithRef<'div'>;

/** Treated as decorative (`aria-hidden`) — same convention `CardHeader`'s icon slot uses. */
const EmptyStateIcon = React.forwardRef<HTMLDivElement, EmptyStateIconProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="div"
        aria-hidden="true"
        className={cn('mb-2 text-[var(--empty-state-icon)] [&_svg]:h-10 [&_svg]:w-10', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
EmptyStateIcon.displayName = 'EmptyStateIcon';

type EmptyStateTitleProps = PrimitivePropsWithRef<'h3'>;

const EmptyStateTitle = React.forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="h3"
        className={cn('text-base font-semibold text-[var(--empty-state-title-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
EmptyStateTitle.displayName = 'EmptyStateTitle';

type EmptyStateDescriptionProps = PrimitivePropsWithRef<'p'>;

const EmptyStateDescription = React.forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="p"
        className={cn('max-w-sm text-sm text-[var(--empty-state-description-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
EmptyStateDescription.displayName = 'EmptyStateDescription';

type EmptyStateActionProps = PrimitivePropsWithRef<'div'>;

const EmptyStateAction = React.forwardRef<HTMLDivElement, EmptyStateActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive as="div" className={cn('mt-4', className)} {...rest} ref={forwardedRef} />
    );
  },
);
EmptyStateAction.displayName = 'EmptyStateAction';

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
};
export type {
  EmptyStateProps,
  EmptyStateIconProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionProps,
};
