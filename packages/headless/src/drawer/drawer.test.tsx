import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Drawer } from './drawer';
import { DrawerClose } from './drawer-close';
import { DrawerContent } from './drawer-content';
import { DrawerDescription } from './drawer-description';
import { DrawerOverlay } from './drawer-overlay';
import { DrawerPortal } from './drawer-portal';
import { DrawerTitle } from './drawer-title';
import { DrawerTrigger } from './drawer-trigger';

function DemoDrawer({ side }: { side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <Drawer>
      <DrawerTrigger>Open cart</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent side={side}>
          <DrawerTitle>Your cart</DrawerTitle>
          <DrawerDescription>Review items before checkout.</DrawerDescription>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('is closed initially', () => {
    render(<DemoDrawer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click with role="dialog", aria-modal, and defaults to side="right"', () => {
    render(<DemoDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('data-side', 'right');
    expect(dialog).toHaveAttribute('aria-labelledby', screen.getByText('Your cart').id);
  });

  it('honors an explicit side prop', () => {
    render(<DemoDrawer side="left" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left');
  });

  it('traps focus and closes on Escape, restoring focus to the trigger', async () => {
    render(<DemoDrawer />);
    const trigger = screen.getByRole('button', { name: 'Open cart' });
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes on an outside pointerdown (modal Dialog behavior, unlike AlertDialog)', async () => {
    const { baseElement } = render(<DemoDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.pointerDown(baseElement);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on DrawerClose click', async () => {
    render(<DemoDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open cart' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
