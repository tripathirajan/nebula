import { KbdShortcut } from './kbd-shortcut';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/KbdShortcut',
  component: KbdShortcut,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof KbdShortcut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { keys: ['Ctrl', 'Shift', 'P'] },
};

export const TightSymbolStyle: Story = {
  args: { keys: ['⌘', 'K'], separator: null },
};

export const CustomSeparator: Story = {
  args: { keys: ['Ctrl', 'K'], separator: 'then' },
};
