import { useState } from 'react';

import { Draggable } from '../draggable';

import { Droppable } from './droppable';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Droppable> = {
  title: 'React UI/Droppable',
  component: Droppable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const zoneStyle: React.CSSProperties = {
  width: 240,
  minHeight: 120,
  padding: 12,
  borderRadius: 8,
  border: '1px dashed var(--card-border)',
};

export const Default: Story = {
  name: 'Empty drop zone (drag a card from the Draggable story onto it)',
  render: () => (
    <Droppable style={zoneStyle} onDrop={() => {}}>
      Drop here
    </Droppable>
  ),
};

export const WithADraggableSource: Story = {
  name: 'With a real drag source',
  render: () => {
    function Demo() {
      const [dropped, setDropped] = useState<string | null>(null);
      return (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Draggable
            id="card-1"
            style={{
              border: '1px solid var(--card-border)',
              borderRadius: 8,
              padding: '8px 12px',
              background: 'var(--card-bg)',
            }}
          >
            Drag me
          </Draggable>
          <Droppable style={zoneStyle} onDrop={(id) => setDropped(id)}>
            {dropped ? `Dropped: ${dropped}` : 'Drop here'}
          </Droppable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <Droppable disabled style={zoneStyle} onDrop={() => {}}>
      Disabled — won&apos;t accept drops
    </Droppable>
  ),
};
