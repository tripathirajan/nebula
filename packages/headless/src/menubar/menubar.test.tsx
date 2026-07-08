import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Menubar } from './menubar';
import { MenubarContent } from './menubar-content';
import { MenubarItem } from './menubar-item';
import { MenubarMenu } from './menubar-menu';
import { MenubarPortal } from './menubar-portal';
import { MenubarTrigger } from './menubar-trigger';

function DemoMenubar() {
  return (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={() => {}}>New file</MenubarItem>
            <MenubarItem onSelect={() => {}}>Save</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem onSelect={() => {}}>Undo</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}

describe('Menubar', () => {
  it('renders role="menubar" with a trigger per MenubarMenu', () => {
    render(<DemoMenubar />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'File' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
  });

  it('is closed initially', () => {
    render(<DemoMenubar />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the clicked menu', () => {
    render(<DemoMenubar />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'File' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'New file' })).toBeInTheDocument();
  });

  it('only one menu is open at a time — opening Edit closes File', async () => {
    render(<DemoMenubar />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: 'New file' })).not.toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();
    });
  });

  it('clicking the open trigger again closes its menu', async () => {
    render(<DemoMenubar />);
    const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
    fireEvent.click(fileTrigger);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.click(fileTrigger);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('focusing a sibling trigger switches the open menu once one is already open', async () => {
    render(<DemoMenubar />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toBeInTheDocument());

    fireEvent.focus(screen.getByRole('menuitem', { name: 'Edit' }));
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: 'New file' })).not.toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Undo' })).toBeInTheDocument();
    });
  });

  it('focusing a sibling trigger does nothing while no menu is open', () => {
    render(<DemoMenubar />);
    fireEvent.focus(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ArrowRight moves focus from File to Edit trigger', () => {
    render(<DemoMenubar />);
    const fileTrigger = screen.getByRole('menuitem', { name: 'File' });
    const editTrigger = screen.getByRole('menuitem', { name: 'Edit' });
    fileTrigger.focus();

    fireEvent.keyDown(fileTrigger, { key: 'ArrowRight' });
    expect(editTrigger).toHaveFocus();
  });

  it('selects an item and closes the menu', async () => {
    render(<DemoMenubar />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    const save = await screen.findByRole('menuitem', { name: 'Save' });

    fireEvent.click(save);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('has no axe violations (menubar role requires menuitem-role children)', async () => {
    const { container } = render(<DemoMenubar />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
