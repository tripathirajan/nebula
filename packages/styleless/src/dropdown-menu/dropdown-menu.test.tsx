import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DropdownMenu } from './dropdown-menu';
import { DropdownMenuCheckboxItem } from './dropdown-menu-checkbox-item';
import { DropdownMenuContent } from './dropdown-menu-content';
import { DropdownMenuItem } from './dropdown-menu-item';
import { DropdownMenuLabel } from './dropdown-menu-label';
import { DropdownMenuPortal } from './dropdown-menu-portal';
import { DropdownMenuRadioGroup } from './dropdown-menu-radio-group';
import { DropdownMenuRadioItem } from './dropdown-menu-radio-item';
import { DropdownMenuSeparator } from './dropdown-menu-separator';
import { DropdownMenuTrigger } from './dropdown-menu-trigger';

// DropdownMenu is a renamed re-export of Menu (see dropdown-menu.tsx), so this
// suite intentionally mirrors menu.test.tsx's coverage rather than
// re-deriving new cases — it exists to prove the renamed exports actually
// wire up under DropdownMenu's own names, not to re-test Menu's behavior.
function DemoDropdownMenu({ onSelectProfile = vi.fn() }: { onSelectProfile?: () => void }) {
  const [wrap, setWrap] = useState(true);
  const [sort, setSort] = useState('asc');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Account</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={onSelectProfile}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} disabled>
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Compact mode
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="asc">Sort ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Sort descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('is closed initially', () => {
    render(<DemoDropdownMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on trigger click and wires up role="menu" with a matching id', () => {
    render(<DemoDropdownMenu />);
    const trigger = screen.getByRole('button', { name: 'Account' });
    fireEvent.click(trigger);

    const menu = screen.getByRole('menu');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('focuses the first item on open', async () => {
    render(<DemoDropdownMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();
    });
  });

  it('navigates items with ArrowDown and skips disabled items', async () => {
    render(<DemoDropdownMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    const profile = await screen.findByRole('menuitem', { name: 'Profile' });

    fireEvent.keyDown(profile, { key: 'ArrowDown' });
    // "Billing" is disabled and never registers as a focusable item, so
    // ArrowDown from "Profile" should land on the checkbox item next.
    await waitFor(() => {
      expect(screen.getByRole('menuitemcheckbox', { name: 'Compact mode' })).toHaveFocus();
    });
  });

  it('selects an item on click and closes the menu', () => {
    const onSelectProfile = vi.fn();
    render(<DemoDropdownMenu onSelectProfile={onSelectProfile} />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(onSelectProfile).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles a checkbox item without closing being blocked', () => {
    render(<DemoDropdownMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Compact mode' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(checkbox);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('selects a radio item within a DropdownMenuRadioGroup', () => {
    render(<DemoDropdownMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Sort descending' }));
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    expect(screen.getByRole('menuitemradio', { name: 'Sort ascending' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Sort descending' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('does not select a disabled item', () => {
    const onSelectProfile = vi.fn();
    render(<DemoDropdownMenu onSelectProfile={onSelectProfile} />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Billing' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes and restores focus to the trigger on Escape', async () => {
    render(<DemoDropdownMenu />);
    const trigger = screen.getByRole('button', { name: 'Account' });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on Tab', async () => {
    render(<DemoDropdownMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    const profile = await screen.findByRole('menuitem', { name: 'Profile' });

    fireEvent.keyDown(profile, { key: 'Tab' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});
