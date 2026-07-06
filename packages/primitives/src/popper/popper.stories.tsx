import { expect, within } from '@storybook/test';


import { Popper } from './popper';
import { PopperAnchor } from './popper-anchor';
import { PopperContent } from './popper-content';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Primitives/Popper',
  component: Popper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ paddingTop: 100 }}>
      <Popper>
        <PopperAnchor asChild>
          <button type="button">Anchor</button>
        </PopperAnchor>
        <PopperContent
          side="bottom"
          align="center"
          sideOffset={8}
          style={{ border: '1px solid', padding: 8, background: 'white' }}
        >
          Positioned content
        </PopperContent>
      </Popper>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByText('Positioned content');
    await expect(content).toHaveAttribute('data-side');
  },
};
