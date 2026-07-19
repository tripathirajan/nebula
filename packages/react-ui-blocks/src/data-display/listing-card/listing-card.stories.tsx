import { Badge } from '@nebula-lab/react-ui/badge';
import { MenuItem } from '@nebula-lab/react-ui/menu';

import { ListingCard } from './listing-card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Data Display/Listing Card',
  component: ListingCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ListingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 .8 3 2c0 3-6 1.5-6 4.5 0 1.2 1.3 2 3 2s3-1.1 3-2.5" />
    </svg>
  );
}

export const Job: Story = {
  name: 'Job listing',
  args: {
    media: (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)] text-2xl font-bold text-[var(--color-primary-content)]">
        A
      </div>
    ),
    title: 'Senior Product Designer',
    subtitle: 'Posted 2 days ago · 24 candidates',
    meta: [
      { icon: <BriefcaseIcon />, label: 'Full-time' },
      { icon: <DollarIcon />, label: '$90k - $120k' },
    ],
    actions: (
      <>
        <MenuItem onSelect={() => {}}>View details</MenuItem>
        <MenuItem onSelect={() => {}}>Archive</MenuItem>
      </>
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ListingCard {...args} />
    </div>
  ),
};

export const Tour: Story = {
  name: 'Tour listing (mosaic media + price badge)',
  args: {
    media: <div className="h-full w-full bg-[var(--color-info)]" />,
    mediaBadge: (
      <Badge color="neutral" className="bg-black/70 text-white">
        $420
      </Badge>
    ),
    title: 'Mountain retreat weekend',
    subtitle: 'Aspen, Colorado',
    meta: [
      { label: 'Aug 12 - Aug 15' },
      { label: '18 Booked' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ListingCard {...args} />
    </div>
  ),
};

export const BlogPost: Story = {
  name: 'Blog post card (description slot)',
  args: {
    media: <div className="h-full w-full bg-[var(--color-accent)]" />,
    mediaBadge: <Badge color="success">Published</Badge>,
    title: 'The future of design systems',
    subtitle: 'Jayvion Simon · 2 days ago',
    description:
      'A look at how design tokens and composable primitives are changing the way teams build and maintain UI at scale.',
    meta: [{ label: '24 comments' }, { label: '1.2k views' }],
    actions: <MenuItem onSelect={() => {}}>Share</MenuItem>,
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ListingCard {...args} />
    </div>
  ),
};

export const NoActionsOrBadge: Story = {
  args: {
    media: <div className="h-full w-full bg-[var(--color-base-300)]" />,
    title: 'Minimal listing',
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ListingCard {...args} />
    </div>
  ),
};
