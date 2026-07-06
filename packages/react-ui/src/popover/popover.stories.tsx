import { expect, userEvent, within } from '@storybook/test';

import { Button } from '../button/button';

import { Popover } from './popover';
import { PopoverClose } from './popover-close';
import { PopoverContent } from './popover-content';
import { PopoverPortal } from './popover-portal';
import { PopoverTrigger } from './popover-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Popover> = {
  title: 'React UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function FilterPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="bottom" align="start" sideOffset={4}>
          <p className="mb-3">Filter options.</p>
          <PopoverClose asChild>
            <Button size="sm">Done</Button>
          </PopoverClose>
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

    await userEvent.click(trigger);
    const body = within(document.body);
    const content = await body.findByRole('dialog');
    await expect(content.className).toContain('bg-[var(--popover-content-bg)]');

    await userEvent.click(body.getByRole('button', { name: 'Done' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
