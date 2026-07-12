import { cn } from '@nebula/primitives/cn';
import { Card, CardContent } from '@nebula/react-ui/card';
import { IconButton } from '@nebula/react-ui/icon-button';
import { Menu, MenuContent, MenuPortal, MenuTrigger } from '@nebula/react-ui/menu';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface ListingCardMetaItem {
  icon?: React.ReactNode;
  label: React.ReactNode;
}

interface ListingCardProps {
  /** The leading visual — a logo tile, single image, or a custom mosaic. Left entirely to the consumer since the shape varies a lot by domain (a Job listing's square company logo vs. a Tour listing's photo mosaic) — this component only reserves the slot and rounds its top corners to match the card. */
  media: React.ReactNode;
  title: React.ReactNode;
  /** e.g. "Posted 2 days ago". */
  subtitle?: React.ReactNode;
  /** Icon+label meta rows below the title (experience level, salary, location, date range, ...). */
  meta?: ListingCardMetaItem[];
  /** A badge overlaid on the top-right corner of the media slot (e.g. a price badge). */
  mediaBadge?: React.ReactNode;
  /** `MenuItem`s for the overflow menu — same convention `DataTableBlock`/`PaymentMethodList` use for row actions. Omit to render no overflow trigger at all. */
  actions?: React.ReactNode;
  /** @default 'More actions' */
  actionsLabel?: string;
  /** Wraps `title` in an `<a>` when given. */
  href?: string;
  className?: string;
}

/**
 * A generalized listing/browse card — company-logo-tile Job listings and
 * photo-mosaic Tour listings from Minimals both reduce to the same shape
 * (a media slot, a title, meta rows, an optional overflow menu), just with
 * very different `media`/`meta` content (§3.23 Real Estate → *Listing
 * Card*, generalized per the taxonomy's own naming note). Deliberately
 * domain-neutral — lives in `data-display`, not `ecommerce`, since nothing
 * about it is commerce-specific and it's reused as-is for Jobs, Tours, and
 * (by extension) any other "grid of browsable cards" listing.
 *
 * @example
 * ```tsx
 * <ListingCard
 *   media={<img src="/logo.png" alt="" className="h-full w-full object-cover" />}
 *   title="Senior Product Designer"
 *   subtitle="Posted 2 days ago · 24 candidates"
 *   meta={[
 *     { icon: <BriefcaseIcon />, label: 'Full-time' },
 *     { icon: <DollarIcon />, label: '$90k - $120k' },
 *   ]}
 *   actions={<MenuItem onSelect={() => {}}>View details</MenuItem>}
 * />
 * ```
 */
function ListingCard(props: ListingCardProps) {
  const { media, title, subtitle, meta, mediaBadge, actions, actionsLabel = 'More actions', href, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col overflow-hidden', className)}>
      <div className="relative aspect-[16/10] w-full bg-[var(--color-base-200)]">
        {media}
        {mediaBadge ? <div className="absolute right-3 top-3">{mediaBadge}</div> : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Text className="text-base font-semibold">{href ? <a href={href}>{title}</a> : title}</Text>
          {actions ? (
            <Menu>
              <MenuTrigger asChild>
                <IconButton aria-label={actionsLabel} size="sm" className="-mt-1 -mr-1 shrink-0">
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
        </div>
        {subtitle ? <Text className="text-xs opacity-70">{subtitle}</Text> : null}
        {meta && meta.length > 0 ? (
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {meta.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs opacity-80">
                {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { ListingCard };
export type { ListingCardProps, ListingCardMetaItem };
