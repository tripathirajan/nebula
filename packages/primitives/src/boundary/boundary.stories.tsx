import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Boundary } from './boundary';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Primitives/Boundary',
  component: Boundary,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Boundary>;

export default meta;
type Story = StoryObj<typeof meta>;

function Bomb({ armed }: { armed: boolean }) {
  if (armed) throw new Error('Boom');
  return <p>Rendered fine.</p>;
}

function Demo() {
  const [armed, setArmed] = useState(true);
  return (
    <Boundary
      fallback={(error, reset) => (
        <div>
          <p>Caught: {error.message}</p>
          <button
            onClick={() => {
              setArmed(false);
              reset();
            }}
          >
            Try again
          </button>
        </div>
      )}
    >
      <Bomb armed={armed} />
    </Boundary>
  );
}

export const CatchesRenderErrors: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Caught: Boom')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));

    await expect(canvas.getByText('Rendered fine.')).toBeInTheDocument();
  },
};
