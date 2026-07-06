import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface ListOwnProps {
  /** Renders `<ol>` instead of `<ul>` — set when item order is meaningful (matches the native semantics `Breadcrumb`'s own `<ol>` choice documents). @default false */
  ordered?: boolean;
}

type ListProps = PrimitivePropsWithRef<'ul'> & ListOwnProps;

/**
 * A plain list of `ListItem`s — purely presentational structure, no
 * `@nebula/styleless` compound underneath (unlike `Menu`/`Tree`, this has no
 * interactive selection/focus behavior at all; for that, reach for
 * `Listbox`/`Menu` instead). No default bullet/number marker styling —
 * `list-none` by default, since most product UI lists (settings rows,
 * search results, notification feeds) don't want native markers; opt back
 * into them via `className="list-disc pl-5"` etc. when you do.
 *
 * @example
 * ```tsx
 * <List>
 *   <ListItem>First item</ListItem>
 *   <ListItem>Second item</ListItem>
 * </List>
 * ```
 */
const List = React.forwardRef<HTMLUListElement, ListProps>((props, forwardedRef) => {
  const { className, ordered = false, ...rest } = props;
  return (
    <Primitive
      as={ordered ? 'ol' : 'ul'}
      className={cn('list-none space-y-1 text-[var(--list-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
List.displayName = 'List';

type ListItemProps = PrimitivePropsWithRef<'li'>;

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return <Primitive as="li" className={cn('text-sm', className)} {...rest} ref={forwardedRef} />;
});
ListItem.displayName = 'ListItem';

export { List, ListItem };
export type { ListProps, ListItemProps };
