import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

interface SideNavGroupProps {
  /** The section label rendered above `children`, e.g. `"Settings"`. Always required — an unlabeled visual grouping isn't distinguishable from a second `SideNav`, so if you don't need a label you don't need `SideNavGroup` either, just render the `SideNavItem`s directly inside `SideNav`. */
  label: string;
  children: React.ReactNode;
  /**
   * Visually hides `label` (`sr-only`, not unmounted — a screen reader still
   * announces the section) to match a collapsed `Sidebar`'s icon-only width,
   * same prop/threading convention `SideNavItem`'s own `collapsed` uses.
   * @default false
   */
  collapsed?: boolean;
  className?: string;
}

/**
 * A labeled section inside `SideNav` — e.g. grouping "Reports"/"Analytics"
 * under a "Data" heading, the same "section label above related items"
 * pattern many real sidebar nav bars use. Purely presentational — no
 * expand/collapse interaction of its own (that's a different, heavier
 * component this isn't; nothing in this repo currently needs one, so it
 * wasn't spec'd speculatively). `label` is a real heading (`role="group"` +
 * `aria-labelledby`), not just a styled `<span>`, so assistive tech
 * announces the section the same way a sighted user reads it visually.
 *
 * @example
 * ```tsx
 * <SideNavGroup label="Settings">
 *   <SideNavItem icon={<UserIcon />} label="Profile" href="/settings/profile" />
 *   <SideNavItem icon={<BellIcon />} label="Notifications" href="/settings/notifications" />
 * </SideNavGroup>
 * ```
 */
const SideNavGroup = React.forwardRef<HTMLDivElement, SideNavGroupProps>((props, forwardedRef) => {
  const { label, children, collapsed = false, className } = props;
  const labelId = React.useId();

  return (
    <Primitive
      as="div"
      role="group"
      aria-labelledby={labelId}
      className={cn('flex flex-col gap-1 py-2', className)}
      ref={forwardedRef}
    >
      <span
        id={labelId}
        className={cn(
          'px-3 text-xs font-semibold uppercase tracking-wide text-[var(--side-nav-group-label-text)]/70',
          collapsed && 'sr-only',
        )}
      >
        {label}
      </span>
      {children}
    </Primitive>
  );
});

SideNavGroup.displayName = 'SideNavGroup';

export { SideNavGroup };
export type { SideNavGroupProps };
