import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { DismissableLayer } from './dismissable-layer';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Primitives/DismissableLayer',
  component: DismissableLayer,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DismissableLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ padding: 40 }}>
      <button data-testid="outside">Outside</button>
      {open && (
        <DismissableLayer
          onDismiss={() => setOpen(false)}
          style={{ border: '1px solid', padding: 12, marginTop: 8 }}
        >
          <p data-testid="layer-content">Click outside or press Escape to dismiss.</p>
        </DismissableLayer>
      )}
    </div>
  );
}

export const DismissOnOutsideClick: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('layer-content')).toBeInTheDocument();

    await userEvent.click(canvas.getByTestId('outside'));

    await expect(canvas.queryByTestId('layer-content')).not.toBeInTheDocument();
  },
};

export const DismissOnEscape: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('layer-content')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByTestId('layer-content')).not.toBeInTheDocument();
  },
};
