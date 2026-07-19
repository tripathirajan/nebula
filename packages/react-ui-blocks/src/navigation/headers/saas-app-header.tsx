import { cn } from '@nebula-lab/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula-lab/react-ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nebula-lab/react-ui/dropdown-menu';
import { Heading } from '@nebula-lab/react-ui/heading';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPortal,
  NavigationMenuTrigger,
} from '@nebula-lab/react-ui/navigation-menu';
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@nebula-lab/react-ui/popover';
import { Sheet, SheetContent, SheetPortal, SheetTitle, SheetTrigger } from '@nebula-lab/react-ui/sheet';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';

const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    {...props}
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface AppHeaderNavSubItem {
  label: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface AppHeaderNavLink {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** Sub-items — when present, this becomes a dropdown menu trigger (via `NavigationMenu`) instead of a plain link. */
  items?: AppHeaderNavSubItem[];
}

interface AppHeaderNotification {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  read?: boolean;
}

interface AppHeaderUserMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
  /** Renders a `DropdownMenuSeparator` above this item, for grouping e.g. "Sign out" apart from the rest. */
  separatorBefore?: boolean;
}

interface SaasAppHeaderProps {
  /** An icon/image mark rendered left of `brand` — decorative, `aria-hidden`; the accessible name comes from `brand`. */
  logo?: React.ReactNode;
  /** A string is wrapped in a `Heading`; any other node (e.g. a custom brand mark) passes through untouched. */
  brand: React.ReactNode;
  brandHref?: string;
  navLinks?: AppHeaderNavLink[];
  /** Omit entirely to hide the notification bell; pass `[]` to show the bell with an empty-state panel. */
  notifications?: AppHeaderNotification[];
  onNotificationClick?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  /** Omitting `avatarSrc` falls back to `AvatarFallback` showing `name`'s first letter. */
  user?: { name: string; role?: React.ReactNode; avatarSrc?: string };
  userMenuItems?: AppHeaderUserMenuItem[];
  /** Starts fully transparent (no border, no background) and gains a frosted `backdrop-blur` + semi-transparent surface once the page scrolls past a small threshold — the header-over-hero-image treatment marketing/landing-style app shells use. `false` (the default) keeps the header a plain, always-solid surface. @default false */
  glass?: boolean;
  className?: string;
}

/** How far (px) the page must scroll before a `glass` header switches from fully transparent to its frosted, scrolled surface. */
const GLASS_SCROLL_THRESHOLD = 8;

function MobileNavLink(props: {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  indent?: boolean;
}) {
  const { label, href, onClick, active, indent } = props;
  const className = cn(
    'rounded-[var(--radius-selector)] px-3 py-2 text-left text-sm transition-colors',
    indent && 'ml-2',
    active ? 'bg-[var(--color-base-200)] font-semibold' : 'hover:bg-[var(--color-base-200)]',
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} aria-current={active ? 'page' : undefined} className={className}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

function MobileNavEntry({ link }: { link: AppHeaderNavLink }) {
  if (link.items && link.items.length > 0) {
    return (
      <div className="flex flex-col gap-1 py-1">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide opacity-60">
          {link.label}
        </span>
        {link.items.map((item) => (
          <MobileNavLink
            key={String(item.label)}
            label={item.label}
            href={item.href}
            onClick={item.onClick}
            indent
          />
        ))}
      </div>
    );
  }
  return (
    <MobileNavLink label={link.label} href={link.href} onClick={link.onClick} active={link.active} />
  );
}

/**
 * A modern SaaS application header: logo + brand + primary nav (desktop:
 * `NavigationMenu` with optional dropdown sub-menus; mobile: a `Sheet` slide-
 * over, `md:hidden`/`hidden md:block` split, same breakpoint convention
 * `BottomNav` uses) on the left, a notification bell (`Popover` panel,
 * unread-count pulse dot) and a user profile menu on the right. Built
 * purely from `@nebula-lab/react-ui` (`NavigationMenu`, `Popover`, `Sheet`,
 * `DropdownMenu`, `Avatar`, `IconButton`) — no marketing-specific primitive
 * exists below this layer, so this block owns the whole composition,
 * matching every other block in this package. Named `SaasAppHeader` rather
 * than `AppHeader` — `BLOCKS_ARCHITECTURE.md` §7's naming table explicitly
 * flags `AppHeader` as ambiguous ("which app context?"); this is
 * specifically the "logo + nav + user menu, no marketing nav" header
 * variant it lists as "SaaS App Header".
 *
 * The trigger for the user menu is the bare `Avatar` — no name/role text
 * beside it — keeping a fixed, compact `h-14` header regardless of how long
 * `user.name`/`user.role` are; `name`/`role` are shown at the top of the
 * opened `DropdownMenuContent` instead (the same "signed in as" placement
 * GitHub's own account menu uses), not lost, just not competing for header
 * height.
 *
 * `sticky top-0` at `--z-sticky` by default so it stays visible while
 * scrolling long dashboard content — below every floating overlay in this
 * repo (`--z-overlay`) and `BottomNav`'s `--z-bottom-nav`, so overlays and
 * the mobile tab bar always stack above it.
 *
 * `glass` swaps the always-solid surface for a scroll-reactive one: fully
 * transparent (no border, no background) at the top of the page, then a
 * frosted `backdrop-blur` over a translucent `--color-base-100` once
 * scrolled past `GLASS_SCROLL_THRESHOLD`. The translucent background is
 * built with `color-mix()` via inline `style`, not a Tailwind `/opacity`
 * suffix on the arbitrary `bg-[var(--color-base-100)]` value — that suffix
 * form doesn't reliably generate a rule for arbitrary CSS-variable values
 * in this project's Tailwind setup (see `button.tsx`'s header comment for
 * the same finding). The scroll listener only attaches when `glass` is
 * true, and only listens on `window` — a `glass` header inside its own
 * scroll container (e.g. a modal) isn't a supported case yet.
 *
 * @example
 * ```tsx
 * <SaasAppHeader
 *   logo={<Logo />}
 *   brand="Acme"
 *   navLinks={[
 *     { label: 'Overview', href: '/', active: true },
 *     { label: 'Products', items: [
 *       { label: 'Analytics', description: 'Usage and funnels', href: '/products/analytics' },
 *       { label: 'Billing', description: 'Plans and invoices', href: '/products/billing' },
 *     ] },
 *   ]}
 *   notifications={[{ id: '1', title: 'New comment', description: 'Jane replied to your ticket', read: false }]}
 *   user={{ name: 'Jane Cooper', role: 'Admin', avatarSrc: '/users/42.jpg' }}
 *   userMenuItems={[
 *     { label: 'Settings' },
 *     { label: 'Sign out', separatorBefore: true },
 *   ]}
 *   glass
 * />
 * ```
 */
function SaasAppHeader(props: SaasAppHeaderProps) {
  const {
    logo,
    brand,
    brandHref,
    navLinks,
    notifications,
    onNotificationClick,
    onMarkAllNotificationsRead,
    user,
    userMenuItems,
    glass = false,
    className,
  } = props;

  const hasNavLinks = Boolean(navLinks && navLinks.length > 0);
  const unreadCount = notifications?.filter((notification) => !notification.read).length ?? 0;

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    if (!glass) return;
    function handleScroll() {
      setScrolled(window.scrollY > GLASS_SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [glass]);

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] flex h-14 items-center justify-between gap-4 px-4 transition-[background-color,backdrop-filter,border-color] duration-[var(--motion-duration-fast)] sm:px-6',
        glass
          ? cn('border-b', scrolled ? 'border-[var(--color-base-300)] backdrop-blur-md' : 'border-transparent')
          : 'border-b border-[var(--color-base-300)] bg-[var(--color-base-100)]',
        className,
      )}
      style={glass && scrolled ? { backgroundColor: 'color-mix(in oklch, var(--color-base-100) 70%, transparent)' } : undefined}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        {hasNavLinks ? (
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                aria-label="Open navigation menu"
                variant="ghost"
                color="neutral"
                size="sm"
                className="md:hidden"
              >
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetPortal>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="mb-4">Menu</SheetTitle>
                <nav className="flex flex-col gap-1">
                  {navLinks?.map((link) => (
                    <MobileNavEntry key={String(link.label)} link={link} />
                  ))}
                </nav>
              </SheetContent>
            </SheetPortal>
          </Sheet>
        ) : null}

        <div className="flex min-w-0 items-center gap-2">
          {logo ? (
            <span aria-hidden="true" className="flex shrink-0 items-center">
              {logo}
            </span>
          ) : null}
          {typeof brand === 'string' ? (
            brandHref ? (
              <Heading as="a" href={brandHref} level={5} className="truncate font-bold">
                {brand}
              </Heading>
            ) : (
              <Heading as="span" level={5} className="truncate font-bold">
                {brand}
              </Heading>
            )
          ) : (
            brand
          )}
        </div>

        {hasNavLinks ? (
          <NavigationMenu aria-label="Primary" className="hidden md:block">
            <NavigationMenuList>
              {navLinks?.map((link, index) =>
                link.items && link.items.length > 0 ? (
                  <NavigationMenuItem key={String(link.label)} value={`nav-item-${index}`}>
                    <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                    <NavigationMenuPortal>
                      <NavigationMenuContent aria-label={String(link.label)}>
                        <div className="flex flex-col gap-1">
                          {link.items.map((item) => (
                            <NavigationMenuLink key={String(item.label)} href={item.href} onClick={item.onClick}>
                              <span className="block font-medium">{item.label}</span>
                              {item.description ? (
                                <span className="block text-xs opacity-70">{item.description}</span>
                              ) : null}
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuPortal>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={String(link.label)}>
                    <NavigationMenuLink href={link.href} onClick={link.onClick} active={link.active}>
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {notifications ? (
          <Popover>
            <PopoverTrigger asChild>
              <IconButton
                aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
                variant="text"
                color="neutral"
                size="sm"
                className="relative"
              >
                <BellIcon />
                {unreadCount > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-[var(--button-danger-bg)]"
                  />
                ) : null}
              </IconButton>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent align="end" aria-label="Notifications" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-[var(--popover-content-border)] px-4 py-3">
                  <Text className="text-sm font-semibold">Notifications</Text>
                  {unreadCount > 0 && onMarkAllNotificationsRead ? (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsRead}
                      className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Mark all as read
                    </button>
                  ) : null}
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm opacity-70">You&apos;re all caught up.</p>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => onNotificationClick?.(notification.id)}
                          className="flex w-full flex-col gap-0.5 border-b border-[var(--popover-content-border)] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--color-base-200)]"
                        >
                          <span className="flex items-center gap-2">
                            {!notification.read ? (
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]"
                              />
                            ) : null}
                            <span className="text-sm font-medium">{notification.title}</span>
                          </span>
                          {notification.description ? (
                            <span className="pl-3.5 text-xs opacity-70">{notification.description}</span>
                          ) : null}
                          {notification.timestamp ? (
                            <span className="pl-3.5 text-xs opacity-50">{notification.timestamp}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        ) : null}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${user.name} account menu`}
                className="shrink-0 rounded-full transition-opacity hover:opacity-80"
              >
                <Avatar>
                  {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent align="end" className="w-56">
                {/* Name/role live here rather than beside the trigger, so the
                    header stays a compact icon-only avatar (matches the
                    header-height feedback this block got) — same "signed
                    in as" placement GitHub's own account menu uses. */}
                <div className="flex flex-col gap-0.5 px-2 py-1.5">
                  <span className="truncate text-sm font-medium">{user.name}</span>
                  {user.role ? <span className="truncate text-xs opacity-70">{user.role}</span> : null}
                </div>
                <DropdownMenuSeparator />
                {userMenuItems?.map((item, index) => (
                  <React.Fragment key={String(item.label)}>
                    {item.separatorBefore && index > 0 ? <DropdownMenuSeparator /> : null}
                    <DropdownMenuItem onSelect={item.onSelect}>{item.label}</DropdownMenuItem>
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}

export { SaasAppHeader };
export type {
  SaasAppHeaderProps,
  AppHeaderNavLink,
  AppHeaderNavSubItem,
  AppHeaderNotification,
  AppHeaderUserMenuItem,
};
