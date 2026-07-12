import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

/**
 * Same two-axis shape `Paper` uses (see `paper.tsx`) — `variant="outlined"`
 * always renders a visible border and no shadow regardless of `elevation`;
 * `variant="elevation"` renders a shadow (depth controlled by `elevation`)
 * and no border. `elevation={0}` under the default `"elevation"` variant is
 * the flat/borderless look (no shadow, no border).
 */
const cardVariants = cva('rounded-[var(--radius-card)] bg-[var(--card-bg)] text-[var(--card-text)]', {
  variants: {
    variant: {
      elevation: 'border-0',
      outlined: 'border border-[var(--card-border)] shadow-none',
    },
    elevation: {
      0: 'shadow-none',
      1: 'shadow-sm',
      2: 'shadow-md',
      3: 'shadow-lg',
    },
  },
  compoundVariants: [
    // `elevation` is only visually meaningful under variant="elevation" —
    // force it inert under "outlined" so passing both never doubles up a shadow.
    { variant: 'outlined', elevation: [0, 1, 2, 3], class: 'shadow-none' },
  ],
  defaultVariants: { variant: 'elevation', elevation: 1 },
});

type CardProps = PrimitivePropsWithRef<'div'> & VariantProps<typeof cardVariants>;

/**
 * A bordered container — `CardHeader`/`CardTitle`/`CardDescription`/
 * `CardContent`/`CardFooter` are purely presentational structure, no
 * behavior, so (unlike `Accordion`/`Dialog`/`Popover`) there's no matching
 * `@nebula/headless` compound underneath this one; it's a thin `cn()`
 * wrapper around `Primitive` directly, same as `Badge`/`Separator`.
 *
 * Colors read `--card-*` (see `../tokens/component.ts`).
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader icon={<SettingsIcon />}>
 *     <CardTitle>Project settings</CardTitle>
 *     <CardDescription>Manage your project's configuration.</CardDescription>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter>
 *     <Button>Save</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Only want a title, no header border/icon layout? Skip CardHeader entirely:
 * <Card>
 *   <CardTitle className="p-6 pb-0">Just a title</CardTitle>
 *   <CardContent>...</CardContent>
 * </Card>
 *
 * // Outlined instead of the default shadow-elevated look, flat (no border,
 * // no shadow) via elevation={0}:
 * <Card variant="outlined">...</Card>
 * <Card elevation={0}>...</Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, variant, elevation, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn(cardVariants({ variant, elevation }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
Card.displayName = 'Card';

interface CardHeaderProps extends CardProps {
  /**
   * Renders a dashed divider under the header, visually separating it from
   * `CardContent` — set `false` if the header shouldn't be visually
   * distinguished from the rest of the card (e.g. a card with no
   * `CardContent` at all). If you only want a title with no border/icon
   * layout at all, skip `CardHeader` entirely and render `CardTitle`
   * directly as `Card`'s child instead.
   * @default true
   */
  bordered?: boolean;
  /**
   * An icon (or any node) rendered beside the header's title/description
   * stack, e.g. a section glyph next to `CardTitle`. Treated as decorative
   * (`aria-hidden`) — the accessible name still comes from the visible
   * `CardTitle` text, same convention `AccordionTrigger`'s chevron and
   * `Checkbox`'s check mark use.
   */
  icon?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((props, forwardedRef) => {
  const { className, bordered = true, icon, children, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn(
        'flex flex-col gap-1.5 p-[calc(var(--size-card)*3)]',
        bordered && 'border-b border-dashed border-[var(--card-border)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      {icon ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="shrink-0 text-[var(--card-text)]">
            {icon}
          </span>
          <div className="flex flex-1 flex-col gap-1.5">{children}</div>
        </div>
      ) : (
        children
      )}
    </Primitive>
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
  return <Primitive as="div" className={cn('p-[calc(var(--size-card)*3)] gap-4', className)} {...rest} ref={forwardedRef} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="div"
      className={cn('flex items-center gap-2 p-[calc(var(--size-card)*3)] pt-0', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
export type { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps };
