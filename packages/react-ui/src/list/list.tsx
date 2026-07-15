import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface ListOwnProps {
  /** Renders `<ol>` instead of `<ul>` — set when item order is meaningful (matches the native semantics `Breadcrumb`'s own `<ol>` choice documents). @default false */
  ordered?: boolean;
  /** Tightens every descendant `ListItem`/`ListItemButton`'s vertical padding — reflected as `data-dense` on the root and read by both via `group-data-[dense]:*`, the same technique `DataTableHead`'s sort chevron uses to react to an ancestor's state, so density stays a single prop instead of threading a value through every item by hand. @default false */
  dense?: boolean;
}

type ListProps = PrimitivePropsWithRef<'ul'> & ListOwnProps;

/**
 * A plain list of `ListItem`s — purely presentational structure, no
 * `@nebula/headless` compound underneath (unlike `Menu`/`Tree`, this has no
 * interactive selection/focus behavior at all; for that, reach for
 * `Listbox`/`Menu` instead). No default bullet/number marker styling —
 * `list-none` by default, since most product UI lists (settings rows,
 * search results, notification feeds) don't want native markers; opt back
 * into them via `className="list-disc pl-5"` etc. when you do.
 *
 * For a clickable row, nest `ListItemButton` inside `ListItem` (passing
 * `disablePadding` to the outer `ListItem` so padding isn't doubled) rather
 * than making `ListItem` itself clickable — same "the semantic container and
 * the interactive control are different elements" split `Menu`/`MenuItem`
 * and every other compound in this package already follows.
 *
 * @example
 * ```tsx
 * <List>
 *   <ListItem>
 *     <ListItemAvatar><Avatar>...</Avatar></ListItemAvatar>
 *     <ListItemText primary="Jane Cooper" secondary="jane@example.com" />
 *   </ListItem>
 *   <ListItem disablePadding>
 *     <ListItemButton onClick={() => {}}>
 *       <ListItemIcon><SettingsIcon /></ListItemIcon>
 *       <ListItemText primary="Settings" />
 *     </ListItemButton>
 *   </ListItem>
 * </List>
 * ```
 */
const List = React.forwardRef<HTMLUListElement, ListProps>((props, forwardedRef) => {
  const { className, ordered = false, dense = false, ...rest } = props;
  return (
    <Primitive
      as={ordered ? 'ol' : 'ul'}
      data-dense={dense ? '' : undefined}
      className={cn('group/list list-none space-y-1 text-[var(--list-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
List.displayName = 'List';

interface ListItemOwnProps {
  /** Omit the default horizontal/vertical padding — set this when the item's real content is a full-bleed `ListItemButton`, which supplies its own padding, so the two don't stack. @default false */
  disablePadding?: boolean;
}

type ListItemProps = PrimitivePropsWithRef<'li'> & ListItemOwnProps;

/**
 * One row in a `List` — `position: relative` by default so a
 * `ListItemSecondaryAction` (absolutely positioned) has a positioning
 * context to anchor to regardless of whether this item's main content is
 * plain text, a `ListItemButton`, or a custom composition.
 */
const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>((props, forwardedRef) => {
  const { className, disablePadding = false, ...rest } = props;
  return (
    <Primitive
      as="li"
      className={cn(
        'relative flex items-center gap-3 text-sm',
        !disablePadding && 'px-3 py-2 group-data-[dense]/list:py-1',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});
ListItem.displayName = 'ListItem';

interface ListItemButtonOwnProps {
  /** Fills the row with `--list-item-selected-bg`/`-text` — for a row representing the current selection (an active nav link, the current settings section), not a hover/focus state. @default false */
  selected?: boolean;
}

type ListItemButtonProps = PrimitivePropsWithRef<'button'> & ListItemButtonOwnProps;

/**
 * The clickable variant of a list row — a real `<button>`, so it comes with
 * native keyboard operability (Tab/Enter/Space) and `disabled` handling for
 * free, the same reasoning `MenuItem`/`Tab` document for reaching for a real
 * interactive element instead of a `<div onClick>`. Ring-inset on
 * `:focus-visible` with no offset, matching `Tab`/`AccordionTrigger`'s
 * "embedded strip control" focus-ring convention rather than a standalone
 * control's `ring-offset-1`/`-2` (see `primitive.ts`'s focus-ring comment).
 *
 * @example
 * ```tsx
 * <ListItem disablePadding>
 *   <ListItemButton selected={activeId === item.id} onClick={() => select(item.id)}>
 *     <ListItemText primary={item.label} />
 *   </ListItemButton>
 * </ListItem>
 * ```
 */
const ListItemButton = React.forwardRef<HTMLButtonElement, ListItemButtonProps>(
  (props, forwardedRef) => {
    const { className, selected = false, type = 'button', ...rest } = props;
    return (
      <Primitive
        as="button"
        type={type}
        data-selected={selected ? '' : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-[var(--radius-selector)] px-3 py-2 text-left outline-none transition-colors group-data-[dense]/list:py-1',
          'hover:bg-[var(--list-item-hover-bg)]',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--list-text)]',
          'data-[selected]:bg-[var(--list-item-selected-bg)] data-[selected]:text-[var(--list-item-selected-text)]',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
ListItemButton.displayName = 'ListItemButton';

type ListItemIconProps = PrimitivePropsWithRef<'span'>;

/** A leading, decorative icon slot — `aria-hidden`, since the row's accessible name comes from `ListItemText`/the button's own visible text, same convention `CardHeader`'s optional `icon` prop documents. */
const ListItemIcon = React.forwardRef<HTMLSpanElement, ListItemIconProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="span"
        aria-hidden="true"
        className={cn('flex h-5 w-5 shrink-0 items-center justify-center text-[var(--list-text)]/60', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
ListItemIcon.displayName = 'ListItemIcon';

type ListItemAvatarProps = PrimitivePropsWithRef<'span'>;

/** A leading avatar slot — just a `shrink-0` wrapper around whatever `Avatar` composition is passed as `children`; owns no avatar logic itself (that's `Avatar`'s job), mirroring `ListItemIcon`'s "layout slot, not a component" role. */
const ListItemAvatar = React.forwardRef<HTMLSpanElement, ListItemAvatarProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return <Primitive as="span" className={cn('flex shrink-0', className)} {...rest} ref={forwardedRef} />;
  },
);
ListItemAvatar.displayName = 'ListItemAvatar';

interface ListItemTextOwnProps {
  /** The row's main line — renders as `children` instead when omitted, so `<ListItemText>Plain label</ListItemText>` still works for a single-line item that doesn't need the primary/secondary split. */
  primary?: React.ReactNode;
  /** An optional second line below `primary`, e.g. an email, a timestamp, a preview snippet. */
  secondary?: React.ReactNode;
}

type ListItemTextProps = PrimitivePropsWithRef<'div'> & ListItemTextOwnProps;

/**
 * The two-line primary/secondary text stack every list row's main content
 * resolves to — `min-w-0 flex-1` so it truncates correctly instead of
 * pushing a trailing `ListItemSecondaryAction`/trailing content out of the
 * row when the text is long, the same `min-w-0`/`truncate` fix
 * `DashboardOverview`'s trend text needed for the identical flex-truncation
 * class of bug.
 *
 * @example
 * ```tsx
 * <ListItemText primary="Jane Cooper" secondary="jane@example.com" />
 * ```
 */
const ListItemText = React.forwardRef<HTMLDivElement, ListItemTextProps>((props, forwardedRef) => {
  const { className, primary, secondary, children, ...rest } = props;
  return (
    <Primitive as="div" className={cn('min-w-0 flex-1', className)} {...rest} ref={forwardedRef}>
      {primary !== undefined ? (
        <>
          <div className="truncate text-sm font-medium text-[var(--list-text)]">{primary}</div>
          {secondary !== undefined ? (
            <div className="truncate text-xs text-[var(--list-text)]/70">{secondary}</div>
          ) : null}
        </>
      ) : (
        children
      )}
    </Primitive>
  );
});
ListItemText.displayName = 'ListItemText';

type ListItemSecondaryActionProps = PrimitivePropsWithRef<'div'>;

/** A trailing slot (an `IconButton`, a `Switch`, a timestamp) pinned to the row's right edge — absolutely positioned against `ListItem`'s own `position: relative`, so it sits outside `ListItemButton`'s clickable area instead of nesting one interactive control inside another, an invalid ARIA structure `PlanCards`' own doc comment already flags for the same reason. */
const ListItemSecondaryAction = React.forwardRef<HTMLDivElement, ListItemSecondaryActionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="div"
        className={cn('absolute right-3 top-1/2 -translate-y-1/2', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
ListItemSecondaryAction.displayName = 'ListItemSecondaryAction';

type ListSubheaderProps = PrimitivePropsWithRef<'li'>;

/** A non-interactive section label between groups of `ListItem`s — a real `<li>` (valid anywhere inside a `<ul>`/`<ol>`, unlike a `<div>`), `sticky top-0` by default so it stays visible while its section scrolls past, matching the pattern MUI's own `ListSubheader` uses for the same reason. */
const ListSubheader = React.forwardRef<HTMLLIElement, ListSubheaderProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="li"
      className={cn(
        'sticky top-0 z-[var(--z-local)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--list-text)]/60',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});
ListSubheader.displayName = 'ListSubheader';

export {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
};
export type {
  ListProps,
  ListItemProps,
  ListItemButtonProps,
  ListItemIconProps,
  ListItemAvatarProps,
  ListItemTextProps,
  ListItemSecondaryActionProps,
  ListSubheaderProps,
};
