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

// Wrapping `Default` in a fixed-width `<div>` would NOT actually exercise its
// `sm:`/`md:` classes differently per frame — Tailwind's responsive variants
// are `@media (min-width: …)` queries keyed off the real viewport, not the
// width of a containing element, so every frame would render identically
// regardless of its CSS width. A real `<iframe>` per breakpoint sidesteps
// that: each iframe is its own browsing context with its own
// `window.innerWidth`, so the same story's media queries evaluate
// independently in each one — the same reason Storybook's own viewport
// toolbar resizes the *iframe*, not a wrapper div, when you switch devices.
// This is a reusable pattern (not a shared component, per this file's own
// "local, unexported, demo-only" convention already used by composition
// stories elsewhere in this package) — copy `ResponsivePreview` into any
// other `.stories.tsx` that wants a side-by-side breakpoint view, pointing
// `storyId` at that file's own default-export story id
// (`<kebab-title>--<kebab-story-name>`).
function ResponsivePreview(props: { storyId: string; height?: number }) {
  const { storyId, height = 520 } = props;
  const frames = [
    { label: 'Mobile', width: 375 },
    { label: 'Tablet', width: 768 },
    { label: 'Desktop', width: 1280 },
  ];
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {frames.map((frame) => (
        <div key={frame.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            {frame.label} · {frame.width}px
          </span>
          <iframe
            title={`${frame.label} preview`}
            src={`iframe.html?id=${storyId}&viewMode=story`}
            style={{ width: frame.width, height, border: '1px solid var(--card-border)', borderRadius: 8 }}
          />
        </div>
      ))}
    </div>
  );
}

export const Responsive: Story = {
  // `render` ignores `args` entirely (it embeds `Default` itself, in three
  // iframes) — still required by `StoryObj<typeof meta>`'s type since `meta`
  // declares `component: ProfileHeader`, whose `avatarFallback`/`name` are
  // required props.
  args: { avatarFallback: 'J', name: 'Jayvion Simon' },
  parameters: { layout: 'fullscreen', chromatic: { disableSnapshot: true } },
  render: () => <ResponsivePreview storyId="blocks-social-profile-header--default" />,
};
