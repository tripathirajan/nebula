import { Button } from '@nebula/react-ui';

import { PageSection } from './page-section';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Layouts/Page Section',
  component: PageSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Billing',
    description: 'Manage your plan and payment method.',
    children: <p className="text-sm">Section content goes here.</p>,
  },
};

export const WithActions: Story = {
  args: {
    title: 'Team members',
    description: 'People with access to this workspace.',
    actions: <Button color="primary">Invite member</Button>,
    children: <p className="text-sm">Member list goes here.</p>,
  },
};
