import { expect, userEvent, within } from '@storybook/test';


import { FocusItem } from './focus-item';
import { RovingFocusGroup } from './roving-focus-group';

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

/** A toolbar built on `RovingFocusGroup` + `FocusItem` — only one button is ever Tab-reachable at a time; arrow keys move which one. */
const meta = {
  title: 'Primitives/RovingFocusGroup',
  component: RovingFocusGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RovingFocusGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function Toolbar(props: ComponentProps<typeof RovingFocusGroup>) {
  return (
    <RovingFocusGroup {...props} style={{ display: 'flex', gap: 4 }}>
      {['Bold', 'Italic', 'Underline'].map((label) => (
        <FocusItem asChild key={label}>
          <button style={{ padding: '6px 10px' }}>{label}</button>
        </FocusItem>
      ))}
    </RovingFocusGroup>
  );
}

export const Default: Story = {
  render: () => <Toolbar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: 'Bold' });
    const italic = canvas.getByRole('button', { name: 'Italic' });

    await expect(bold).toHaveAttribute('tabindex', '0');
    await expect(italic).toHaveAttribute('tabindex', '-1');

    bold.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(italic).toHaveFocus();
    await expect(italic).toHaveAttribute('tabindex', '0');
  },
};

export const Looping: Story = {
  render: () => <Toolbar loop />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole('button', { name: 'Bold' });
    const underline = canvas.getByRole('button', { name: 'Underline' });

    bold.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(underline).toHaveFocus();
  },
};
