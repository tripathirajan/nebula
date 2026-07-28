import { Alert } from './alert';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Heads up',
    children: 'This is an informational message.',
  },
};

export const Colors: Story = {
  args: { children: 'This is an informational message.' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} color="info" title="Info" />
      <Alert {...args} color="success" title="Success" />
      <Alert {...args} color="warning" title="Warning" />
      <Alert {...args} color="danger" title="Danger" />
    </div>
  ),
};

export const Variants: Story = {
  args: { color: 'danger', title: 'Something went wrong', children: 'Your changes could not be saved.' },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} variant="filled" />
      <Alert {...args} variant="soft" />
      <Alert {...args} variant="outline" />
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    variant: 'soft',
    color: 'success',
    title: 'Profile updated',
    children: 'Your changes have been saved.',
    onDismiss: () => {},
    dismissLabel: 'Dismiss',
  },
};

export const WithoutTitle: Story = {
  args: {
    color: 'info',
    children: 'A short, single-line message with no title.',
  },
};
