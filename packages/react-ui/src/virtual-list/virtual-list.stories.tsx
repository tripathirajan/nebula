import { Avatar, AvatarFallback } from '@nebula/react-ui/avatar';
import { expect, within } from '@storybook/test';

import { VirtualList } from './virtual-list';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof VirtualList> = {
  title: 'React UI/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const contacts = Array.from({ length: 5000 }, (_, index) => ({
  id: String(index),
  name: `Contact ${index}`,
  email: `contact${index}@example.com`,
}));

export const Default: Story = {
  render: () => (
    <div style={{ width: 360, border: '1px solid var(--card-border)', borderRadius: 8 }}>
      <VirtualList
        items={contacts}
        height={400}
        estimateItemHeight={56}
        getItemId={(contact) => contact.id}
        itemClassName="flex items-center gap-3 border-b border-[var(--card-border)] px-4"
        renderItem={(contact) => (
          <>
            <Avatar className="h-9 w-9">
              <AvatarFallback>{contact.name.charAt(contact.name.length - 1)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{contact.name}</div>
              <div className="truncate text-xs opacity-70">{contact.email}</div>
            </div>
          </>
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list')).toBeInTheDocument();
    await expect(canvas.getByText('Contact 0')).toBeInTheDocument();
    await expect(canvas.queryByText('Contact 4999')).not.toBeInTheDocument();
  },
};
