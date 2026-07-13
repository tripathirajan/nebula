import { cn } from '@nebula/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Card } from '@nebula/react-ui/card';
import { IconButton } from '@nebula/react-ui/icon-button';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface TeamMemberSocialLink {
  icon: React.ReactNode;
  href: string;
  /** Accessible name for the link, e.g. "Twitter". */
  label: string;
}

interface TeamMemberStat {
  label: string;
  value: React.ReactNode;
}

interface TeamMemberCardProps {
  avatarSrc?: string;
  avatarFallback: string;
  name: string;
  /** e.g. "UI Designer" — named `jobTitle`, not `role`, since `role` as a bare JSX attribute reads as (and gets linted as) the ARIA `role` attribute. */
  jobTitle?: React.ReactNode;
  socialLinks?: TeamMemberSocialLink[];
  /** e.g. Followers/Following/Posts. */
  stats?: TeamMemberStat[];
  className?: string;
}

/**
 * A team-member grid card — cover placeholder + overlapping avatar +
 * name/role + social-platform icon row + stat triple, Minimals' User
 * Cards page (§3.10 Team → *Team Member List*, card variant). Not a
 * compact `ProfileHeader`: the two share a "cover + overlapping avatar"
 * silhouette but differ in almost everything else — centered vs.
 * left-aligned content, no tabs here, a social-link row `ProfileHeader`
 * doesn't have — forcing them into one variant-driven component would
 * mean most of each one's props only apply in one mode.
 *
 * @example
 * ```tsx
 * <TeamMemberCard
 *   avatarFallback="J"
 *   name="Jayvion Simon"
 *   jobTitle="UI Designer"
 *   socialLinks={[{ icon: <TwitterIcon />, href: 'https://twitter.com/...', label: 'Twitter' }]}
 *   stats={[{ label: 'Followers', value: '1.2k' }, { label: 'Following', value: '345' }, { label: 'Posts', value: '52' }]}
 * />
 * ```
 */
function TeamMemberCard(props: TeamMemberCardProps) {
  const { avatarSrc, avatarFallback, name, jobTitle, socialLinks, stats, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col overflow-hidden', className)}>
      <div className="h-16 w-full bg-[var(--color-base-200)]" />
      <div className="flex flex-col items-center gap-1 px-4 pb-4">
        <Avatar className="-mt-8 h-16 w-16 border-4 border-[var(--card-bg)]">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="text-lg">{avatarFallback}</AvatarFallback>
        </Avatar>
        <Text className="text-sm font-semibold">{name}</Text>
        {jobTitle ? <Text className="text-xs opacity-70">{jobTitle}</Text> : null}
        {socialLinks && socialLinks.length > 0 ? (
          <div className="mt-2 flex gap-1">
            {socialLinks.map((link) => (
              <IconButton key={link.label} asChild variant="text" color="neutral" size="sm" aria-label={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.icon}
                </a>
              </IconButton>
            ))}
          </div>
        ) : null}
        {stats && stats.length > 0 ? (
          <div className="mt-3 flex w-full items-center justify-around border-t border-[var(--card-border)] pt-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <Text className="text-sm font-semibold">{stat.value}</Text>
                <Text className="text-xs opacity-70">{stat.label}</Text>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export { TeamMemberCard };
export type { TeamMemberCardProps, TeamMemberSocialLink, TeamMemberStat };
