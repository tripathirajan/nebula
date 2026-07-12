import { ProfileHeader } from './profile-header';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Social/Profile Header',
  component: ProfileHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatarFallback: 'J',
    name: 'Jayvion Simon',
    jobTitle: 'UI Designer',
    stats: [
      { label: 'Followers', value: '1.2k' },
      { label: 'Following', value: '345' },
    ],
    tabs: [
      { value: 'profile', label: 'Profile', content: 'Bio and about content goes here.' },
      { value: 'followers', label: 'Followers', content: 'Follower list goes here.' },
      { value: 'gallery', label: 'Gallery', content: 'Photo gallery goes here.' },
    ],
    defaultActiveTab: 'profile',
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <ProfileHeader {...args} />
    </div>
  ),
};

export const NoStatsOrTabs: Story = {
  name: 'Minimal (no stats or tabs)',
  args: { avatarFallback: 'J', name: 'Jayvion Simon', jobTitle: 'UI Designer' },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <ProfileHeader {...args} />
    </div>
  ),
};
