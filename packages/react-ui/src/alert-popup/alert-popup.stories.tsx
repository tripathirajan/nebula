import { expect, userEvent, waitFor, within } from '@storybook/test';

import { Button } from '../button/button';

import { AlertPopup } from './alert-popup';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/AlertPopup',
  component: AlertPopup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AlertPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    trigger: <Button color="success">Save changes</Button>,
    icon: 'success',
    title: 'Saved!',
    description: 'Your changes have been saved successfully.',
    primaryAction: { label: 'OK' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));

    const body = within(document.body);
    const popup = await body.findByRole('alertdialog');
    await waitFor(() => expect(getComputedStyle(popup).opacity).toBe('1'));
    await expect(body.getByText('Saved!')).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

export const ConfirmDanger: Story = {
  name: 'Danger (with a secondary/cancel action)',
  args: {
    trigger: <Button color="danger">Delete account</Button>,
    icon: 'danger',
    title: 'Delete your account?',
    description: "This can't be undone — all your data will be permanently removed.",
    primaryAction: { label: 'Delete' },
    secondaryAction: { label: 'Cancel' },
  },
};

export const Warning: Story = {
  args: {
    trigger: <Button color="warning">Leave page</Button>,
    icon: 'warning',
    title: 'Unsaved changes',
    description: "You have unsaved changes that will be lost if you leave.",
    primaryAction: { label: 'Leave' },
    secondaryAction: { label: 'Stay' },
  },
};

export const Info: Story = {
  args: {
    trigger: <Button>What&apos;s new</Button>,
    icon: 'info',
    title: "What's new",
    description: 'This release adds swipe gestures and a blurred dialog backdrop.',
    primaryAction: { label: 'Got it' },
  },
};

export const Question: Story = {
  name: 'Question (neutral confirm, no severity)',
  args: {
    trigger: <Button color="secondary">Log out</Button>,
    icon: 'question',
    title: 'Log out?',
    primaryAction: { label: 'Log out' },
    secondaryAction: { label: 'Cancel' },
  },
};

export const NoIcon: Story = {
  name: 'No icon (icon={null})',
  args: {
    trigger: <Button color="secondary">Open</Button>,
    icon: null,
    title: 'Simple confirmation',
    description: 'Not every popup needs a severity icon.',
    primaryAction: { label: 'OK' },
  },
};

export const BlurredBackdrop: Story = {
  name: 'Blurred backdrop (backdrop="blur")',
  args: { title: 'Delete this item?', primaryAction: { label: 'Delete' } },
  render: () => (
    <div className="grid w-[320px] grid-cols-3 gap-2">
      {['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed'].map((color) => (
        <div key={color} style={{ backgroundColor: color }} className="col-span-1 h-16 rounded-lg" />
      ))}
      <div className="col-span-3 mt-2">
        <AlertPopup
          trigger={<Button color="danger">Delete item</Button>}
          icon="danger"
          backdrop="blur"
          title="Delete this item?"
          description="This can't be undone."
          primaryAction={{ label: 'Delete' }}
          secondaryAction={{ label: 'Cancel' }}
        />
      </div>
    </div>
  ),
};
