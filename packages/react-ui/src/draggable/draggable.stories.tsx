import { useState } from 'react';

import { Droppable } from '../droppable';

import { Draggable } from './draggable';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Draggable> = {
  title: 'React UI/Draggable',
  component: Draggable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--card-border)',
  borderRadius: 8,
  padding: '8px 12px',
  background: 'var(--card-bg)',
  marginBottom: 8,
};

function KanbanDemo() {
  const [columns, setColumns] = useState<Record<string, string[]>>({
    todo: ['card-1', 'card-2'],
    done: ['card-3'],
  });

  function moveCard(id: string, toColumn: string) {
    setColumns((previous) => {
      const next: Record<string, string[]> = {};
      for (const [column, ids] of Object.entries(previous)) {
        next[column] = ids.filter((cardId) => cardId !== id);
      }
      next[toColumn] = [...(next[toColumn] ?? []), id];
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {Object.entries(columns).map(([column, ids]) => (
        <Droppable
          key={column}
          onDrop={(id) => moveCard(id, column)}
          style={{ width: 200, minHeight: 160, padding: 8, borderRadius: 8, background: 'var(--color-base-200)' }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', opacity: 0.6 }}>
            {column}
          </div>
          {ids.map((id) => (
            <Draggable key={id} id={id} style={cardStyle}>
              {id}
            </Draggable>
          ))}
        </Droppable>
      ))}
    </div>
  );
}

export const Default: Story = {
  name: 'Kanban demo (Draggable + Droppable)',
  render: () => <KanbanDemo />,
};

export const Disabled: Story = {
  render: () => (
    <Draggable id="card-1" disabled style={cardStyle}>
      Locked card (drag disabled)
    </Draggable>
  ),
};
