import { cn } from '@nebula-lab/primitives/cn';
import { Card } from '@nebula-lab/react-ui/card';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { Menu, MenuContent, MenuPortal, MenuTrigger } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

interface CardListItemProps {
  /** A leading `Avatar` — mutually exclusive with `icon` in practice (pass whichever fits the row), rendered in the same `h-10 w-10 shrink-0` slot either way. */
  avatar?: React.ReactNode;
  /** A leading decorative icon, alternative to `avatar` for rows with no natural image (a transaction category, a file type) — rendered `aria-hidden` in a tinted circle, the same "icon badge" treatment `DashboardMetric`'s stat-card icons use. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing content on the row's right edge — an amount, a status `Badge`, a timestamp. Sits to the left of the overflow menu when both are given. */
  trailing?: React.ReactNode;
  /** `MenuItem`s for the row's overflow menu — same convention `DataTableBlock`/`ListingCard`'s row actions use. Omit to render no overflow trigger at all. */
  actions?: React.ReactNode;
  /** @default 'Row actions' */
  actionsLabel?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * One row of a table's data rendered as a self-contained card instead of a
 * `<tr>` — the small-screen fallback `DataTableBlock` switches to below its
 * `cardBreakpoint` (a `<table>`'s fixed columns don't reflow onto a narrow
 * viewport the way a stacked list of cards does), but also usable on its
 * own for any "list of user/transaction/notification rows" that was never
 * going to be a table in the first place. Deliberately domain-neutral —
 * lives in `data-display`, not tied to users or transactions specifically,
 * the same "generalize once the domain-specific parts are left to the
 * consumer" call `ListingCard` documents.
 *
 * When both `onClick` and `actions` are given, the row's click target is a
 * real `<button>` absolutely positioned under the row's content (the
 * "stretched button" pattern), not `role="button"` on the row itself — a
 * `role="button"` wrapping a real focusable `IconButton` (the actions
 * trigger) is a WCAG "nested interactive controls" violation, caught by
 * `vitest-axe` the first time this component actually composed both props
 * together. The stretched button reads its accessible name off `title` via
 * `aria-labelledby` (works whether `title` is a plain string or a more
 * complex node) rather than requiring a separate `aria-label` prop just for
 * this. `avatar`/text/`trailing` sit visually on top of it with
 * `pointer-events-none` so a click anywhere on them still reaches the
 * button underneath; `actions`' `Menu` is a normal sibling with its default
 * `pointer-events: auto`, so it stays independently clickable.
 *
 * @example
 * ```tsx
 * <CardListItem
 *   avatar={<Avatar><AvatarFallback>J</AvatarFallback></Avatar>}
 *   title="Jane Cooper"
 *   description="jane@example.com"
 *   trailing={<Badge color="success">Active</Badge>}
 *   actions={<MenuItem onSelect={() => {}}>Edit</MenuItem>}
 * />
 * ```
 */
function CardListItem(props: CardListItemProps) {
  const { avatar, icon, title, description, trailing, actions, actionsLabel = 'Row actions', onClick, className } =
    props;

  const titleId = React.useId();
  const isInteractive = onClick !== undefined;

  return (
    <Card variant="outlined" className={cn('relative flex items-center gap-3 p-3', className)}>
      {isInteractive ? (
        <button
          type="button"
          aria-labelledby={titleId}
          onClick={onClick}
          className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-base-content)]"
        />
      ) : null}
      {avatar ? (
        <div className="pointer-events-none flex h-10 w-10 shrink-0 items-center justify-center">{avatar}</div>
      ) : null}
      {icon && !avatar ? (
        <div
          aria-hidden="true"
          className="pointer-events-none flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-base-200)] text-[var(--color-base-content)]"
        >
          {icon}
        </div>
      ) : null}
      <div className="pointer-events-none min-w-0 flex-1">
        {/* `Text` defaults to an inline `<span>` — `truncate`'s `text-overflow:
        ellipsis` has no effect on `display: inline` (only block-ish boxes),
        so without `block` here this text silently overflows past its
        measured width into `trailing` instead of actually truncating; caught
        by measuring a real overlap between the description and a trailing
        badge, not just eyeballing a screenshot. */}
        <Text id={titleId} className="block truncate text-sm font-medium">
          {title}
        </Text>
        {description ? <Text className="block truncate text-xs opacity-70">{description}</Text> : null}
      </div>
      {trailing ? <div className="pointer-events-none shrink-0 text-right text-sm">{trailing}</div> : null}
      {actions ? (
        <Menu>
          <MenuTrigger asChild>
            <IconButton aria-label={actionsLabel} size="sm" variant="ghost" className="shrink-0">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </IconButton>
          </MenuTrigger>
          <MenuPortal>
            <MenuContent align="end">{actions}</MenuContent>
          </MenuPortal>
        </Menu>
      ) : null}
    </Card>
  );
}

export { CardListItem };
export type { CardListItemProps };
