import { useState } from 'react';

import { Sortable } from './sortable';
import { SortableItem } from './sortable-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Sortable> = {
  title: 'React UI/Sortable',
  component: Sortable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const itemStyle: React.CSSProperties = {
  border: '1px solid var(--card-border)',
  borderRadius: 8,
  padding: '8px 12px',
  background: 'var(--card-bg)',
  marginBottom: 8,
};

function SortableDemo() {
  const [items, setItems] = useState(['Design', 'Development', 'QA', 'Launch']);
  return (
    <div style={{ width: 240 }}>
      <Sortable items={items} onReorder={setItems}>
        {items.map((id) => (
          <SortableItem key={id} id={id} style={itemStyle}>
            {id}
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export const Default: Story = {
  name: 'Reorderable list (drag items to reorder)',
  render: () => <SortableDemo />,
};

function SortableWithDisabledDemo() {
  const [items, setItems] = useState(['Design', 'Development', 'QA', 'Launch']);
  return (
    <div style={{ width: 240 }}>
      <Sortable items={items} onReorder={setItems}>
        {items.map((id) => (
          <SortableItem key={id} id={id} disabled={id === 'QA'} style={itemStyle}>
            {id} {id === 'QA' ? '(locked)' : ''}
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export const WithADisabledItem: Story = {
  name: 'With one locked (non-draggable) item',
  render: () => <SortableWithDisabledDemo />,
};

export const HorizontalOrientation: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(['One', 'Two', 'Three']);
      return (
        <Sortable items={items} onReorder={setItems} orientation="horizontal" style={{ gap: 8 }}>
          {items.map((id) => (
            <SortableItem key={id} id={id} style={itemStyle}>
              {id}
            </SortableItem>
          ))}
        </Sortable>
      );
    }
    return <Demo />;
  },
};
