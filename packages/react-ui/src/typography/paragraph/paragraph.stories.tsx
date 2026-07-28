import { Paragraph } from './paragraph';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paragraph> = {
  title: 'React UI/Typography/Paragraph',
  component: Paragraph,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-prose">
      <Paragraph>
        A block of body copy that reads comfortably at paragraph length, without needing a
        manually-applied leading-relaxed class every time — distinct from `Text`, which carries no
        line-height opinion and is meant for inline runs.
      </Paragraph>
    </div>
  ),
};
