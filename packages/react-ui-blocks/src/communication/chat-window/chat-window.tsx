import { cn } from '@nebula/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Badge } from '@nebula/react-ui/badge';
import { Button } from '@nebula/react-ui/button';
import { Card } from '@nebula/react-ui/card';
import { EmptyState, EmptyStateDescription, EmptyStateTitle } from '@nebula/react-ui/empty-state';
import { Input } from '@nebula/react-ui/input';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface ChatContact {
  id: string;
  name: string;
  avatarSrc?: string;
  /** A preview line, e.g. the last message's text. */
  lastMessage?: React.ReactNode;
  /** Pre-formatted, e.g. "2m ago". */
  lastMessageTime?: React.ReactNode;
  unreadCount?: number;
  online?: boolean;
}

interface ChatMessage {
  id: string;
  /** Must match a `ChatContact.id`, or `currentUserId` for a message the current user sent. */
  authorId: string;
  content: React.ReactNode;
  /** Pre-formatted, e.g. "10:42 AM". */
  timestamp?: React.ReactNode;
}

interface ChatWindowProps {
  contacts: ChatContact[];
  activeContactId?: string;
  onActiveContactChange?: (id: string) => void;
  /** Messages for the currently active conversation only — this component has no notion of "all conversations," the consumer already filtered by `activeContactId`. */
  messages: ChatMessage[];
  currentUserId: string;
  /** Omit to render the composer `disabled` (e.g. a read-only transcript view). */
  onSendMessage?: (content: string) => void;
  emptyStateTitle?: React.ReactNode;
  emptyStateDescription?: React.ReactNode;
  className?: string;
}

/**
 * A single-conversation chat window — contact list + message thread +
 * composer, Minimals' Chat page (§3.19 Communication → *Chat Window*).
 * Explicitly no real-time backend: `messages` is the consumer's own state
 * for whichever `activeContactId` conversation is selected (same
 * "consumer owns the data, this owns the chrome" split `DataTableBlock`/
 * `Combobox` use), and `onSendMessage` only reports the composer's
 * submitted text — appending it to `messages`, persisting it, or wiring a
 * real transport (WebSocket, polling, ...) is entirely up to the
 * consumer. The composer's own draft text is local, uncontrolled UI state
 * (same precedent `DataTableBlock`'s page-size `<select>` sets) — nothing
 * external would ever need to pre-populate or observe an in-progress,
 * unsent draft.
 *
 * @example
 * ```tsx
 * <ChatWindow
 *   contacts={[{ id: '1', name: 'Jayvion Simon', lastMessage: 'See you then!', unreadCount: 2, online: true }]}
 *   activeContactId={activeId}
 *   onActiveContactChange={setActiveId}
 *   messages={messagesForActiveContact}
 *   currentUserId="me"
 *   onSendMessage={(content) => setMessages((prev) => [...prev, { id: crypto.randomUUID(), authorId: 'me', content }])}
 * />
 * ```
 */
function ChatWindow(props: ChatWindowProps) {
  const {
    contacts,
    activeContactId,
    onActiveContactChange,
    messages,
    currentUserId,
    onSendMessage,
    emptyStateTitle = 'No conversation selected',
    emptyStateDescription = 'Choose a contact from the list to view the conversation.',
    className,
  } = props;
  const [draft, setDraft] = React.useState('');
  const activeContact = contacts.find((contact) => contact.id === activeContactId);

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed || !onSendMessage) return;
    onSendMessage(trimmed);
    setDraft('');
  }

  return (
    <Card
      variant="outlined"
      className={cn('grid h-[560px] grid-cols-[280px_1fr] overflow-hidden p-0', className)}
    >
      <div className="flex flex-col overflow-y-auto border-r border-[var(--card-border)]">
        <ul className="flex flex-col">
          {contacts.map((contact) => {
            const isActive = contact.id === activeContactId;
            return (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => onActiveContactChange?.(contact.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-[var(--card-border)] p-3 text-left transition-colors hover:bg-[var(--color-base-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-base-content)]',
                    isActive && 'bg-[var(--color-base-200)]',
                  )}
                >
                  <span className="relative shrink-0">
                    <Avatar>
                      {contact.avatarSrc ? <AvatarImage src={contact.avatarSrc} alt="" /> : null}
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.online ? (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card-bg)] bg-[var(--color-success)]"
                      />
                    ) : null}
                  </span>
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <Text className="truncate text-sm font-medium">{contact.name}</Text>
                      {contact.lastMessageTime ? (
                        <Text className="shrink-0 text-xs opacity-60">{contact.lastMessageTime}</Text>
                      ) : null}
                    </div>
                    {contact.lastMessage ? (
                      <Text className="truncate text-xs opacity-70">{contact.lastMessage}</Text>
                    ) : null}
                  </div>
                  {contact.unreadCount ? (
                    <Badge color="primary" className="shrink-0">
                      {contact.unreadCount}
                    </Badge>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col overflow-hidden">
        {activeContact ? (
          <>
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] p-3">
              <Avatar>
                {activeContact.avatarSrc ? <AvatarImage src={activeContact.avatarSrc} alt="" /> : null}
                <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Text className="text-sm font-medium">{activeContact.name}</Text>
            </div>
            <div
              role="log"
              aria-live="polite"
              aria-label={`Conversation with ${activeContact.name}`}
              className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
            >
              {messages.map((message) => {
                const isMine = message.authorId === currentUserId;
                return (
                  <div key={message.id} className={cn('flex flex-col', isMine ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'max-w-[75%] rounded-[var(--radius-box)] px-3 py-2 text-sm',
                        isMine
                          ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)]'
                          : 'bg-[var(--color-base-200)] text-[var(--color-base-content)]',
                      )}
                    >
                      {message.content}
                    </div>
                    {message.timestamp ? (
                      <Text className="mt-0.5 text-[10px] opacity-60">{message.timestamp}</Text>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--card-border)] p-3">
              <Input
                aria-label="Message"
                placeholder="Type a message…"
                value={draft}
                disabled={!onSendMessage}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" disabled={!onSendMessage || draft.trim() === ''} onClick={handleSend}>
                Send
              </Button>
            </div>
          </>
        ) : (
          <EmptyState className="flex-1">
            <EmptyStateTitle>{emptyStateTitle}</EmptyStateTitle>
            <EmptyStateDescription>{emptyStateDescription}</EmptyStateDescription>
          </EmptyState>
        )}
      </div>
    </Card>
  );
}

export { ChatWindow };
export type { ChatWindowProps, ChatContact, ChatMessage };
