import { Badge } from '../../data-display/badge/badge';

import { Wrap } from './wrap';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Wrap> = {
  title: 'React UI/Layout/Wrap',
  component: Wrap,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Wrap gap={8} className="max-w-xs">
      <Badge>React</Badge>
      <Badge>TypeScript</Badge>
      <Badge>Tailwind</Badge>
      <Badge>Vite</Badge>
      <Badge>Nx</Badge>
    </Wrap>
  ),
};
