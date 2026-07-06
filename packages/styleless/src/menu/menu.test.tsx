import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './menu';
import { MenuCheckboxItem } from './menu-checkbox-item';
import { MenuContent } from './menu-content';
import { MenuItem } from './menu-item';
import { MenuLabel } from './menu-label';
import { MenuPortal } from './menu-portal';
import { MenuRadioGroup } from './menu-radio-group';
import { MenuRadioItem } from './menu-radio-item';
import { MenuSeparator } from './menu-separator';
import { MenuTrigger } from './menu-trigger';

function DemoMenu({ onSelectNew = vi.fn() }: { onSelectNew?: () => void }) {
  const [wrap, setWrap] = useState(true);
  const [sort, setSort] = useState('asc');

  return (
    <Menu>
      <MenuTrigger>File</MenuTrigger>
      <MenuPortal>
        <MenuContent>
          <MenuLabel>Actions</MenuLabel>
          <MenuItem onSelect={onSelectNew}>New file</MenuItem>
          <MenuItem onSelect={() => {}} disabled>
            Rename
          </MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Word wrap
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="asc">Ascending</MenuRadioItem>
            <MenuRadioItem value="desc">Descending</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </MenuPortal>
    </Menu>
  );
}

describe('Menu', () => {
  it('is closed initially', () => {
    render(<DemoMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on trigger click and wires up role="menu" with a matching id', () => {
    render(<DemoMenu />);
    const trigger = screen.getByRole('button', { name: 'File' });
    fireEvent.click(trigger);

    const menu = screen.getByRole('menu');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('focuses the first item on open', async () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus();
    });
  });

  it('ArrowDown from the trigger opens the menu and focuses the first item', async () => {
    render(<DemoMenu />);
    const trigger = screen.getByRole('button', { name: 'File' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus();
    });
  });

  it('navigates items with ArrowDown/ArrowUp and skips disabled items', async () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));
    const newFile = await screen.findByRole('menuitem', { name: 'New file' });

    fireEvent.keyDown(newFile, { key: 'ArrowDown' });
    // "Rename" is disabled and never registers as a focusable item, so
    // ArrowDown from "New file" should land on the checkbox item next.
    await waitFor(() => {
      expect(screen.getByRole('menuitemcheckbox', { name: 'Word wrap' })).toHaveFocus();
    });
  });

  it('End jumps to the last item', async () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));
    const newFile = await screen.findByRole('menuitem', { name: 'New file' });

    fireEvent.keyDown(newFile, { key: 'End' });
    await waitFor(() => {
      expect(screen.getByRole('menuitemradio', { name: 'Descending' })).toHaveFocus();
    });
  });

  it('selects an item on click and closes the menu', () => {
    const onSelectNew = vi.fn();
    render(<DemoMenu onSelectNew={onSelectNew} />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'New file' }));
    expect(onSelectNew).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles a checkbox item and closes the menu', () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Word wrap' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(checkbox);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'File' }));
    expect(screen.getByRole('menuitemcheckbox', { name: 'Word wrap' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('selects a radio item within a MenuRadioGroup', () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Descending' }));
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    expect(screen.getByRole('menuitemradio', { name: 'Ascending' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Descending' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('does not select a disabled item', () => {
    const onSelectNew = vi.fn();
    render(<DemoMenu onSelectNew={onSelectNew} />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes and restores focus to the trigger on Escape', async () => {
    render(<DemoMenu />);
    const trigger = screen.getByRole('button', { name: 'File' });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on Tab', async () => {
    render(<DemoMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'File' }));
    const newFile = await screen.findByRole('menuitem', { name: 'New file' });

    fireEvent.keyDown(newFile, { key: 'Tab' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});
