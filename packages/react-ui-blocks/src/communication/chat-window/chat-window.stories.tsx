import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';

import { ChatWindow } from './chat-window';

import type { ChatMessage } from './chat-window';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Communication/Chat Window',
  component: ChatWindow,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChatWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

const contacts = [
  { id: '1', name: 'Jayvion Simon', lastMessage: 'See you at 3pm!', lastMessageTime: '2m', unreadCount: 2, online: true },
  { id: '2', name: 'Ariana Lang', lastMessage: 'Sounds good, thanks.', lastMessageTime: '1h' },
  { id: '3', name: 'Chase Day', lastMessage: 'Can you review the PR?', lastMessageTime: '3h', online: true },
];

const initialMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', authorId: '1', content: 'Hey, are we still on for the design review?', timestamp: '10:30 AM' },
    { id: 'm2', authorId: 'me', content: 'Yep, 3pm works for me.', timestamp: '10:32 AM' },
    { id: 'm3', authorId: '1', content: 'See you at 3pm!', timestamp: '10:33 AM' },
  ],
  '2': [{ id: 'm4', authorId: '2', content: 'Sounds good, thanks.', timestamp: 'Yesterday' }],
  '3': [{ id: 'm5', authorId: '3', content: 'Can you review the PR?', timestamp: '3h ago' }],
};

function ChatWindowDemo() {
  const [activeContactId, setActiveContactId] = useState('1');
  const [messagesByContact, setMessagesByContact] = useState(initialMessages);

  return (
    <ChatWindow
      contacts={contacts}
      activeContactId={activeContactId}
      onActiveContactChange={setActiveContactId}
      messages={messagesByContact[activeContactId] ?? []}
      currentUserId="me"
      onSendMessage={(content) =>
        setMessagesByContact((prev) => ({
          ...prev,
          [activeContactId]: [
            ...(prev[activeContactId] ?? []),
            { id: `m-${Date.now()}`, authorId: 'me', content },
          ],
        }))
      }
    />
  );
}

export const Default: Story = {
  // `args` is unused by `render` below (the demo wrapper owns its own
  // conversation state) but still required — `contacts`/`messages`/
  // `currentUserId` have no default, so `Story['args']` isn't optional.
  args: { contacts, messages: [], currentUserId: 'me' },
  render: () => <ChatWindowDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('See you at 3pm!')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Ariana Lang/ }));
    await waitFor(() => expect(canvas.getByText('Sounds good, thanks.')).toBeInTheDocument());

    const input = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(input, 'On it!{Enter}');
    await waitFor(() => expect(canvas.getByText('On it!')).toBeInTheDocument());
  },
};

export const NoConversationSelected: Story = {
  args: { contacts, messages: [], currentUserId: 'me' },
};

export const ReadOnly: Story = {
  name: 'Read-only (no composer)',
  args: {
    contacts,
    activeContactId: '1',
    messages: initialMessages['1'] ?? [],
    currentUserId: 'me',
  },
};
