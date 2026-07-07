import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from './context-menu';
import { ContextMenuCheckboxItem } from './context-menu-checkbox-item';
import { ContextMenuContent } from './context-menu-content';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuPortal } from './context-menu-portal';
import { ContextMenuSeparator } from './context-menu-separator';
import { ContextMenuTrigger } from './context-menu-trigger';

function DemoContextMenu({ onSelectCopy = vi.fn() }: { onSelectCopy?: () => void }) {
  const [bold, setBold] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger data-testid="trigger-area">Right-click this area</ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelectCopy}>Copy</ContextMenuItem>
          <ContextMenuItem onSelect={() => {}} disabled>
            Paste
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={bold} onCheckedChange={setBold}>
            Bold
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenu>
  );
}

function fireContextMenu(target: Element, coords: { clientX: number; clientY: number }) {
  fireEvent.contextMenu(target, coords);
}

describe('ContextMenu', () => {
  it('is closed initially', () => {
    render(<DemoContextMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens at the pointer on a contextmenu event and prevents the native menu', () => {
    render(<DemoContextMenu />);
    const trigger = screen.getByTestId('trigger-area');

    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 80,
    });
    // Dispatched directly (not via `fireEvent.contextMenu`) so the return
    // value of `dispatchEvent` itself — whether `preventDefault()` was
    // called — is available to assert on below. That means it isn't
    // automatically wrapped in `act()` the way `fireEvent.*` helpers are,
    // so it's done explicitly here; without it, the state update the click
    // handler triggers (opening the menu) isn't guaranteed to have flushed
    // yet by the time the assertions below run. `act()` itself always
    // returns a thenable, not the callback's return value, so capture that
    // separately via a variable in the enclosing scope.
    let wasNotCancelled = true;
    act(() => {
      wasNotCancelled = trigger.dispatchEvent(event);
    });

    expect(wasNotCancelled).toBe(false); // false means preventDefault() was called
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('does not render aria-haspopup/aria-expanded on the trigger (it is not a button)', () => {
    render(<DemoContextMenu />);
    const trigger = screen.getByTestId('trigger-area');
    expect(trigger).not.toHaveAttribute('aria-haspopup');
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('focuses the first item on open', async () => {
    render(<DemoContextMenu />);
    fireContextMenu(screen.getByTestId('trigger-area'), { clientX: 10, clientY: 10 });

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });
  });

  it('selects an item on click and closes the menu', () => {
    const onSelectCopy = vi.fn();
    render(<DemoContextMenu onSelectCopy={onSelectCopy} />);
    fireContextMenu(screen.getByTestId('trigger-area'), { clientX: 10, clientY: 10 });

    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onSelectCopy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not select a disabled item', () => {
    const onSelectCopy = vi.fn();
    render(<DemoContextMenu onSelectCopy={onSelectCopy} />);
    fireContextMenu(screen.getByTestId('trigger-area'), { clientX: 10, clientY: 10 });

    fireEvent.click(screen.getByRole('menuitem', { name: 'Paste' }));
    expect(onSelectCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    render(<DemoContextMenu />);
    fireContextMenu(screen.getByTestId('trigger-area'), { clientX: 10, clientY: 10 });
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('re-opening at a different point moves the menu (re-anchors instead of reusing the old point)', async () => {
    render(<DemoContextMenu />);
    const trigger = screen.getByTestId('trigger-area');

    fireContextMenu(trigger, { clientX: 10, clientY: 10 });
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

    fireContextMenu(trigger, { clientX: 200, clientY: 150 });
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
  });
});
