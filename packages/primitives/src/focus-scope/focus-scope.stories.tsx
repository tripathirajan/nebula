import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';

import { FocusScope } from './focus-scope';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Primitives/FocusScope',
  component: FocusScope,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FocusScope>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open scope</button>
      {open && (
        <FocusScope trapped style={{ border: '1px solid', padding: 12, marginTop: 8 }}>
          <p>Focus moved here automatically on mount.</p>
          <button>First</button>
          <button onClick={() => setOpen(false)}>Close</button>
        </FocusScope>
      )}
    </div>
  );
}

export const AutoFocusOnMount: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Open scope'));

    await waitFor(async () => {
      const first = canvas.getByRole('button', { name: 'First' });
      await expect(first).toHaveFocus();
    });
  },
};
