import { TeamMemberCard } from './team-member-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Dashboard/Team/Team Member Card',
  component: TeamMemberCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TeamMemberCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function TwitterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23 4.5c-.8.4-1.7.6-2.6.8.9-.6 1.6-1.5 2-2.5-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 00-7.7 4.1A12.8 12.8 0 012 3.9a4.5 4.5 0 001.4 6 4.5 4.5 0 01-2-.6v.1a4.5 4.5 0 003.6 4.4 4.5 4.5 0 01-2 .1 4.5 4.5 0 004.2 3.1A9 9 0 012 19a12.7 12.7 0 006.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12.02H3zM9.5 8.98H13v1.64h.05c.5-.94 1.7-1.94 3.5-1.94 3.75 0 4.45 2.47 4.45 5.68v6.64h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1v6h-4z" />
    </svg>
  );
}

export const Default: Story = {
  args: {
    avatarFallback: 'J',
    name: 'Jayvion Simon',
    jobTitle: 'UI Designer',
    socialLinks: [
      { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
      { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
    stats: [
      { label: 'Followers', value: '1.2k' },
      { label: 'Following', value: '345' },
      { label: 'Posts', value: '52' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <TeamMemberCard {...args} />
    </div>
  ),
};

export const Minimal: Story = {
  name: 'No social links or stats',
  args: { avatarFallback: 'J', name: 'Jayvion Simon', jobTitle: 'UI Designer' },
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <TeamMemberCard {...args} />
    </div>
  ),
};
