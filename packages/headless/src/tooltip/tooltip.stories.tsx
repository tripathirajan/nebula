import { expect, userEvent, within } from '@storybook/test';


import { Tooltip } from './tooltip';
import { TooltipContent } from './tooltip-content';
import { TooltipPortal } from './tooltip-portal';
import { TooltipTrigger } from './tooltip-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function LabeledTooltip() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="top" sideOffset={4}>
          Save your changes
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export const Default: Story = {
  render: () => <LabeledTooltip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Save' });

    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.hover(trigger);
    const body = within(document.body);
    const content = await body.findByRole('tooltip');
    await expect(content).toHaveAttribute('data-side');

    await userEvent.unhover(trigger);
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const OpensOnFocus: Story = {
  render: () => <LabeledTooltip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Save' });

    trigger.focus();
    const body = within(document.body);
    await body.findByRole('tooltip');

    trigger.blur();
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
