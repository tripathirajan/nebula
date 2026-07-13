import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ChatWindow } from './chat-window';

const contacts = [
  { id: '1', name: 'Jayvion Simon', lastMessage: 'See you at 3pm!', unreadCount: 2, online: true },
  { id: '2', name: 'Ariana Lang', lastMessage: 'Sounds good, thanks.' },
];

const messages = [
  { id: 'm1', authorId: '1', content: 'Hey there', timestamp: '10:30 AM' },
  { id: 'm2', authorId: 'me', content: 'Hi!', timestamp: '10:32 AM' },
];

describe('ChatWindow (block)', () => {
  it('renders the contact list with unread counts and last messages', () => {
    render(<ChatWindow contacts={contacts} messages={[]} currentUserId="me" />);
    expect(screen.getByText('Jayvion Simon')).toBeInTheDocument();
    expect(screen.getByText('See you at 3pm!')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows an empty state when no contact is active', () => {
    render(<ChatWindow contacts={contacts} messages={[]} currentUserId="me" />);
    expect(screen.getByText('No conversation selected')).toBeInTheDocument();
  });

  it('renders the active conversation transcript, distinguishing sent from received', () => {
    render(<ChatWindow contacts={contacts} activeContactId="1" messages={messages} currentUserId="me" />);
    expect(screen.getByText('Hey there')).toBeInTheDocument();
    expect(screen.getByText('Hi!')).toBeInTheDocument();
  });

  it('reports contact selection', () => {
    const onActiveContactChange = vi.fn();
    render(
      <ChatWindow contacts={contacts} messages={[]} currentUserId="me" onActiveContactChange={onActiveContactChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Ariana Lang/ }));
    expect(onActiveContactChange).toHaveBeenCalledWith('2');
  });

  it('sends a message on Enter and clears the draft, but not on empty input', () => {
    const onSendMessage = vi.fn();
    render(
      <ChatWindow
        contacts={contacts}
        activeContactId="1"
        messages={messages}
        currentUserId="me"
        onSendMessage={onSendMessage}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.change(input, { target: { value: '  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'On it!' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSendMessage).toHaveBeenCalledWith('On it!');
    expect(input).toHaveValue('');
  });

  it('sends a message via the Send button', () => {
    const onSendMessage = vi.fn();
    render(
      <ChatWindow
        contacts={contacts}
        activeContactId="1"
        messages={messages}
        currentUserId="me"
        onSendMessage={onSendMessage}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('disables the composer when onSendMessage is omitted', () => {
    render(<ChatWindow contacts={contacts} activeContactId="1" messages={messages} currentUserId="me" />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('exposes the transcript as a polite live region so new messages get announced', () => {
    render(<ChatWindow contacts={contacts} activeContactId="1" messages={messages} currentUserId="me" />);
    const log = screen.getByRole('log', { name: 'Conversation with Jayvion Simon' });
    expect(log).toHaveAttribute('aria-live', 'polite');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ChatWindow
        contacts={contacts}
        activeContactId="1"
        messages={messages}
        currentUserId="me"
        onSendMessage={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
