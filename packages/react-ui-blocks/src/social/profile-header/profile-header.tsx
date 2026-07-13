import { cn } from '@nebula/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Heading } from '@nebula/react-ui/heading';
import { Tab, TabList, TabPanel, Tabs } from '@nebula/react-ui/tabs';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface ProfileHeaderStat {
  label: string;
  value: React.ReactNode;
}

interface ProfileHeaderTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface ProfileHeaderProps {
  coverSrc?: string;
  avatarSrc?: string;
  avatarFallback: string;
  name: string;
  /** e.g. "UI Designer" — named `jobTitle`, not `role`, since `role` as a bare JSX attribute reads as (and gets linted as) the ARIA `role` attribute. */
  jobTitle?: React.ReactNode;
  /** e.g. Followers/Following counts. */
  stats?: ProfileHeaderStat[];
  /** Each tab's `content` renders in a real `TabPanel` — a `role="tab"` always needs one WAI-ARIA-correct `aria-controls` target, so this never renders bare nav-only tabs with content wired up elsewhere. */
  tabs?: ProfileHeaderTab[];
  activeTab?: string;
  defaultActiveTab?: string;
  onActiveTabChange?: (value: string) => void;
  className?: string;
}

/**
 * A social profile header — cover banner + overlapping avatar + name/role
 * + stat pair + section tabs, Minimals' User Profile page (§3.13 Social →
 * *Profile Header*, *Profile Tabs*). Deliberately stops at the header:
 * the full profile page also has a Feed and Post Composer (§3.13's other
 * two families), but those are independent, page-level pieces a consumer
 * composes alongside this — not something a "header" component should own.
 * Each `tabs[].content` renders in a real `TabPanel`, keeping the
 * `Tab`↔`TabPanel` `aria-controls` relationship WAI-ARIA-correct (see the
 * regression this repo's `headless` layer fixed for `Dialog`/`Popover`/
 * `Select` triggers pointing at unmounted content) rather than rendering
 * navigation-only tabs and leaving the consumer to wire up content
 * elsewhere.
 *
 * @example
 * ```tsx
 * <ProfileHeader
 *   coverSrc="/covers/mountains.jpg"
 *   avatarFallback="J"
 *   name="Jayvion Simon"
 *   jobTitle="UI Designer"
 *   stats={[{ label: 'Followers', value: '1.2k' }, { label: 'Following', value: '345' }]}
 *   tabs={[
 *     { value: 'profile', label: 'Profile', content: <div>Bio...</div> },
 *     { value: 'gallery', label: 'Gallery', content: <div>Photos...</div> },
 *   ]}
 * />
 * ```
 */
function ProfileHeader(props: ProfileHeaderProps) {
  const {
    coverSrc,
    avatarSrc,
    avatarFallback,
    name,
    jobTitle,
    stats,
    tabs,
    activeTab,
    defaultActiveTab,
    onActiveTabChange,
    className,
  } = props;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-box)] border border-[var(--card-border)] bg-[var(--card-bg)]',
        className,
      )}
    >
      <div
        className="h-40 w-full bg-[var(--color-primary)] bg-cover bg-center sm:h-56"
        style={coverSrc ? { backgroundImage: `url(${coverSrc})` } : undefined}
      />
      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-4">
          <Avatar className="h-24 w-24 border-4 border-[var(--card-bg)]">
            {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
            <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-center gap-0.5 sm:items-start sm:pb-2">
            <Heading as="h1" level={4}>
              {name}
            </Heading>
            {jobTitle ? <Text className="text-sm opacity-70">{jobTitle}</Text> : null}
          </div>
          {stats && stats.length > 0 ? (
            <div className="flex gap-6 sm:pb-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <Text className="text-base font-semibold">{stat.value}</Text>
                  <Text className="text-xs opacity-70">{stat.label}</Text>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {tabs && tabs.length > 0 ? (
          <Tabs value={activeTab} defaultValue={defaultActiveTab} onValueChange={onActiveTabChange} className="mt-6">
            <TabList aria-label={`${name}'s profile sections`}>
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value}>
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            {tabs.map((tab) => (
              <TabPanel key={tab.value} value={tab.value} className="pt-4">
                {tab.content}
              </TabPanel>
            ))}
          </Tabs>
        ) : null}
      </div>
    </div>
  );
}

export { ProfileHeader };
export type { ProfileHeaderProps, ProfileHeaderStat, ProfileHeaderTab };
