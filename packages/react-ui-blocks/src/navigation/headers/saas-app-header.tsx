import { cn } from '@nebula/primitives/cn';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  Navbar,
} from '@nebula/react-ui';
import * as React from 'react';

interface AppHeaderNavLink {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Renders with distinct visual weight and `aria-current="page"`. */
  active?: boolean;
}

interface AppHeaderUserMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
  /** Renders a `DropdownMenuSeparator` above this item, for grouping e.g. "Sign out" apart from the rest. */
  separatorBefore?: boolean;
}

interface SaasAppHeaderProps {
  /** A string is wrapped in a `Heading`; any other node (e.g. an `Image` logo) passes through untouched. */
  brand: React.ReactNode;
  brandHref?: string;
  navLinks?: AppHeaderNavLink[];
  /** Omitting `avatarSrc` falls back to `AvatarFallback` showing `name`'s first letter. */
  user?: { name: string; avatarSrc?: string };
  userMenuItems?: AppHeaderUserMenuItem[];
  className?: string;
}

/**
 * A SaaS application header: brand + primary nav on the left, a user avatar
 * menu on the right. Built purely from `@nebula/react-ui` (`Navbar`,
 * `Avatar`, the `DropdownMenu` family). Named `SaasAppHeader` rather than
 * `AppHeader` — `BLOCKS_ARCHITECTURE.md` §7's naming table explicitly flags
 * `AppHeader` as ambiguous ("which app context?"); this is specifically the
 * "logo + nav + user menu, no marketing nav" header variant it lists as
 * "SaaS App Header".
 *
 * @example
 * ```tsx
 * <SaasAppHeader
 *   brand="Acme"
 *   navLinks={[
 *     { label: 'Overview', href: '/', active: true },
 *     { label: 'Reports', href: '/reports' },
 *   ]}
 *   user={{ name: 'Jane Cooper', avatarSrc: '/users/42.jpg' }}
 *   userMenuItems={[
 *     { label: 'Settings', onSelect: () => navigate('/settings') },
 *     { label: 'Sign out', onSelect: signOut, separatorBefore: true },
 *   ]}
 * />
 * ```
 */
function SaasAppHeader(props: SaasAppHeaderProps) {
  const { brand, brandHref, navLinks, user, userMenuItems, className } = props;

  return (
    <header
      className={cn(
        'flex items-center justify-between border-b border-[var(--color-base-300)] px-6 py-3',
        className,
      )}
    >
      <div className="flex items-center gap-8">
        {typeof brand === 'string' ? (
          <Heading as={brandHref ? 'a' : 'span'} level={5} className="font-bold">
            {brand}
          </Heading>
        ) : (
          brand
        )}
        {navLinks && navLinks.length > 0 ? (
          <Navbar>
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={String(link.label)}
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  className={cn('text-sm', link.active ? 'font-semibold' : 'opacity-70 hover:opacity-100')}
                >
                  {link.label}
                </a>
              ) : (
                <Button
                  key={String(link.label)}
                  variant="text"
                  color={link.active ? 'primary' : 'secondary'}
                  onClick={link.onClick}
                >
                  {link.label}
                </Button>
              ),
            )}
          </Navbar>
        ) : null}
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`${user.name} account menu`} className="rounded-full">
              <Avatar>
                {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end">
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
    </header>
  );
}

export { SaasAppHeader };
export type { SaasAppHeaderProps, AppHeaderNavLink, AppHeaderUserMenuItem };
