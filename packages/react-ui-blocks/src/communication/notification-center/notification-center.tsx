import { cn } from '@nebula/primitives/cn';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { Tab, TabList, TabPanel, Tabs } from '@nebula/react-ui/tabs';
import * as React from 'react';

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const BellOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 9.9-4.5M17.7 12.7c.2.9.6 2.2 1.3 3.3H3s3-2 3-9c0-.3 0-.6.05-.9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <path d="m2 2 20 20" />
  </svg>
);

interface NotificationCenterItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  read?: boolean;
  /** An icon or `Avatar` rendered left of the content — decorative, `aria-hidden`. */
  icon?: React.ReactNode;
}

interface NotificationCenterProps {
  /** No sensible default — every notification center has its own feed. */
  notifications: NotificationCenterItem[];
  onNotificationClick?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  title?: React.ReactNode;
  className?: string;
}

function NotificationRow(props: {
  notification: NotificationCenterItem;
  onNotificationClick?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}) {
  const { notification, onNotificationClick, onMarkRead } = props;

  return (
    <li className="group flex items-start gap-3 border-b border-[var(--card-border)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--color-base-200)]">
      {notification.icon ? (
        <span aria-hidden="true" className="mt-0.5 shrink-0">
          {notification.icon}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'mt-1.5 h-2 w-2 shrink-0 rounded-full',
            notification.read ? 'bg-transparent' : 'bg-[var(--color-primary)]',
          )}
        />
      )}
      <button
        type="button"
        onClick={() => onNotificationClick?.(notification.id)}
        className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
      >
        <span className={cn('text-sm', notification.read ? 'font-normal' : 'font-semibold')}>
          {notification.title}
        </span>
        {notification.description ? (
          <span className="text-xs opacity-70">{notification.description}</span>
        ) : null}
        {notification.timestamp ? (
          <span className="text-xs opacity-50">{notification.timestamp}</span>
        ) : null}
      </button>
      {!notification.read && onMarkRead ? (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          aria-label="Mark as read"
          className="shrink-0 rounded-[var(--radius-selector)] p-1.5 opacity-0 transition-opacity hover:bg-[var(--color-base-300)] focus-visible:opacity-100 group-hover:opacity-100"
        >
          <CheckIcon />
        </button>
      ) : null}
    </li>
  );
}

function NotificationList(props: {
  notifications: NotificationCenterItem[];
  onNotificationClick?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}) {
  const { notifications, onNotificationClick, onMarkRead } = props;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <BellOffIcon className="opacity-30" />
        <p className="text-sm opacity-70">Nothing here.</p>
      </div>
    );
  }

  return (
    <ul className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationRow
          key={notification.id}
          notification={notification}
          onNotificationClick={onNotificationClick}
          onMarkRead={onMarkRead}
        />
      ))}
    </ul>
  );
}

/**
 * A standalone notifications inbox — All/Unread tabs (`Tabs`, animated
 * underline via its own `data-[state=active]` treatment), a scrollable
 * list, per-row hover-revealed "mark as read", and a header-level "mark
 * all as read". A fuller, page-level counterpart to `SaasAppHeader`'s own
 * compact notification bell panel (`navigation/headers`) — that one is a
 * small `Popover` for quick triage from anywhere in the app; this is meant
 * to be the destination a "See all notifications" link goes to.
 *
 * @example
 * ```tsx
 * <NotificationCenter
 *   notifications={[
 *     { id: '1', title: 'New comment', description: 'Jane replied to your ticket', timestamp: '2m ago', read: false },
 *   ]}
 *   onMarkRead={(id) => markRead(id)}
 *   onMarkAllRead={markAllRead}
 * />
 * ```
 */
function NotificationCenter(props: NotificationCenterProps) {
  const { notifications, onNotificationClick, onMarkRead, onMarkAllRead, title = 'Notifications', className } =
    props;

  const unread = notifications.filter((notification) => !notification.read);

  return (
    <Card className={cn('w-full max-w-md p-0', className)}>
      <CardHeader bordered={false} className="flex-row items-center justify-between pb-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {unread.length > 0 ? <Badge color="primary">{unread.length}</Badge> : null}
        </div>
        {unread.length > 0 && onMarkAllRead ? (
          <Button variant="text" color="neutral" size="sm" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all">
          <TabList className="px-4">
            <Tab value="all">All</Tab>
            <Tab value="unread">Unread{unread.length > 0 ? ` (${unread.length})` : ''}</Tab>
          </TabList>
          <TabPanel value="all">
            <NotificationList
              notifications={notifications}
              onNotificationClick={onNotificationClick}
              onMarkRead={onMarkRead}
            />
          </TabPanel>
          <TabPanel value="unread">
            <NotificationList
              notifications={unread}
              onNotificationClick={onNotificationClick}
              onMarkRead={onMarkRead}
            />
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { NotificationCenter };
export type { NotificationCenterProps, NotificationCenterItem };
