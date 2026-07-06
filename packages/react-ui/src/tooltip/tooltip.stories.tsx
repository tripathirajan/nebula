import { userEvent, within } from '@storybook/test';

import { Button } from '../button/button';

import { Tooltip } from './tooltip';
import { TooltipContent } from './tooltip-content';
import { TooltipPortal } from './tooltip-portal';
import { TooltipTrigger } from './tooltip-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  title: 'React UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SaveButtonWithTooltip() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="sm">
          Save
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="top" sideOffset={4}>
          Save your changes
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export const Default: Story = {
  render: () => <SaveButtonWithTooltip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Save' });

    await userEvent.hover(trigger);
    const body = within(document.body);
    await body.findByRole('tooltip');
  },
};
