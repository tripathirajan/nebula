import { Code } from '../code/code';

import { Pre } from './pre';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Pre> = {
  title: 'React UI/Typography/Pre',
  component: Pre,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pre className="p-4">
      <Code>{`function greet() {\n  return 'hi';\n}`}</Code>
    </Pre>
  ),
};
