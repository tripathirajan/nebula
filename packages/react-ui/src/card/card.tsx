import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CardProps = PrimitivePropsWithRef<'div'>;

/**
 * A bordered container — `CardHeader`/`CardTitle`/`CardDescription`/
 * `CardContent`/`CardFooter` are purely presentational structure, no
 * behavior, so (unlike `Accordion`/`Dialog`/`Popover`) there's no matching
 * `@nebula/styleless` compound underneath this one; it's a thin `cn()`
 * wrapper around `Primitive` directly, same as `Badge`/`Separator`.
 *
 * Colors read `--card-*` (see `../tokens/component.ts`).
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Project settings</CardTitle>
 *     <CardDescription>Manage your project's configuration.</CardDescription>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter>
 *     <Button>Save</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--card-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
CardHeader.displayName = 'CardHeader';

type CardTitleProps = PrimitivePropsWithRef<'h3'>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="h3"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
CardTitle.displayName = 'CardTitle';

type CardDescriptionProps = PrimitivePropsWithRef<'p'>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="p"
        className={cn('text-sm text-[var(--card-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return <Primitive as="div" className={cn('p-6 pt-0', className)} {...rest} ref={forwardedRef} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn('flex items-center gap-2 p-6 pt-0', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps, CardTitleProps, CardDescriptionProps };
