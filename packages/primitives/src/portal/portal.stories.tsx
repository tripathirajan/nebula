import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';

import { Overlay } from '../overlay/overlay';
import { Presence } from '../presence/presence';

import { Portal } from './portal';

import type { Meta, StoryObj } from '@storybook/react';

/** `Portal`, `Overlay`, and `Presence` composed the way a `Dialog` (once built) will use them. */
const meta = {
  title: 'Primitives/Portal',
  component: Portal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      <Presence present={open}>
        <Portal>
          <Overlay
            data-testid="overlay"
            className="bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div
            data-testid="portal-content"
            style={{
              position: 'fixed',
              top: '40%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              padding: 16,
              border: '1px solid',
            }}
          >
            Portaled content
          </div>
        </Portal>
      </Presence>
    </div>
  );
}

export const RendersOutsideDOMHierarchy: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Open'));

    // Portal renders to document.body, not canvasElement — query the
    // document instead of the story's own canvas.
    await waitFor(() => {
      expect(document.querySelector('[data-testid="portal-content"]')).toBeInTheDocument();
    });
  },
};
