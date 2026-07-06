import { expect, fireEvent, userEvent, waitFor, within } from '@storybook/test';
import * as React from 'react';

import { Toast } from './toast';
import { ToastAction } from './toast-action';
import { ToastClose } from './toast-close';
import { ToastDescription } from './toast-description';
import { ToastTitle } from './toast-title';
import { ToastViewport } from './toast-viewport';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = React.useState(true);
      return (
        <ToastViewport>
          <Toast open={open} onOpenChange={setOpen} duration={Infinity}>
            <ToastTitle>Upload complete</ToastTitle>
            <ToastDescription>report.pdf was uploaded successfully.</ToastDescription>
            <ToastAction altText="Undo the upload">Undo</ToastAction>
            <ToastClose aria-label="Dismiss">×</ToastClose>
          </Toast>
        </ToastViewport>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await expect(canvas.getByText('Upload complete')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument());
  },
};

export const AutoDismiss: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = React.useState(true);
      return (
        <ToastViewport>
          <Toast open={open} onOpenChange={setOpen} duration={100}>
            <ToastTitle>Saved</ToastTitle>
          </Toast>
        </ToastViewport>
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeInTheDocument();

    fireEvent.pointerEnter(canvas.getByRole('status'));
    await new Promise((resolve) => setTimeout(resolve, 150));
    await expect(canvas.getByRole('status')).toBeInTheDocument();

    fireEvent.pointerLeave(canvas.getByRole('status'));
    await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument(), {
      timeout: 2000,
    });
  },
};
