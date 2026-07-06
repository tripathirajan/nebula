import { expect, userEvent, within } from '@storybook/test';

import { Collapsible } from './collapsible';
import { CollapsibleContent } from './collapsible-content';
import { CollapsibleTrigger } from './collapsible-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger>Show more</CollapsibleTrigger>
      <CollapsibleContent>Extra detail that was hidden.</CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show more' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Extra detail that was hidden.')).not.toBeVisible();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Extra detail that was hidden.')).toBeVisible();
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger>Show more</CollapsibleTrigger>
      <CollapsibleContent>Extra detail, already shown.</CollapsibleContent>
    </Collapsible>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled>
      <CollapsibleTrigger>Show more</CollapsibleTrigger>
      <CollapsibleContent>Not reachable while disabled.</CollapsibleContent>
    </Collapsible>
  ),
};
