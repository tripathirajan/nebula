import { expect, userEvent, within } from '@storybook/test';


import { Popover } from './popover';
import { PopoverClose } from './popover-close';
import { PopoverContent } from './popover-content';
import { PopoverPortal } from './popover-portal';
import { PopoverTrigger } from './popover-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function FilterPopover() {
  return (
    <Popover>
      <PopoverTrigger>Filters</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="bottom" align="start" sideOffset={4}>
          <p>Filter options.</p>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

export const Default: Story = {
  render: () => <FilterPopover />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Filters' });

    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const body = within(document.body);
    const content = await body.findByRole('dialog');
    await expect(content).toHaveAttribute('data-side');

    // Trigger toggles: clicking it again while open closes it.
    await userEvent.click(trigger);
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseButton: Story = {
  render: () => <FilterPopover />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));

    const body = within(document.body);
    await body.findByRole('dialog');
    await userEvent.click(body.getByRole('button', { name: 'Done' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
