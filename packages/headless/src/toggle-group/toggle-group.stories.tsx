import { expect, userEvent, within } from '@storybook/test';

import { ToggleGroup } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  // `ToggleGroup`'s `type` prop is a required discriminant (no sensible
  // default — same reasoning as `Accordion`'s own stories meta), so
  // `Meta`/`StoryObj` need a default `args` satisfying it. Every story below
  // overrides via its own `render` anyway.
  args: { type: 'single' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  name: 'Single select (text alignment)',
  render: () => (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Left">
        L
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center">
        C
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right">
        R
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: 'Left' });
    const center = canvas.getByRole('button', { name: 'Center' });

    await expect(left).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(center);
    await expect(center).toHaveAttribute('aria-pressed', 'true');
    await expect(left).toHaveAttribute('aria-pressed', 'false');
  },
};

export const MultipleSelect: Story = {
  name: 'Multiple select (text formatting)',
  render: () => (
    <ToggleGroup type="multiple" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: 'Bold' });
    const italic = canvas.getByRole('button', { name: 'Italic' });

    await userEvent.click(bold);
    await userEvent.click(italic);
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
  },
};
