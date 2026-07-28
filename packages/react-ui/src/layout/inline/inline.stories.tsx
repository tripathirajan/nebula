import { Badge } from '../../data-display/badge/badge';

import { Inline } from './inline';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Inline> = {
  title: 'React UI/Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Inline gap={8} className="max-w-xs">
      <Badge>React</Badge>
      <Badge>TypeScript</Badge>
      <Badge>Tailwind</Badge>
      <Badge>Vite</Badge>
      <Badge>Nx</Badge>
    </Inline>
  ),
};
