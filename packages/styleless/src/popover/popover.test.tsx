import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Popover } from './popover';
import { PopoverClose } from './popover-close';
import { PopoverContent } from './popover-content';
import { PopoverPortal } from './popover-portal';
import { PopoverTrigger } from './popover-trigger';

function DemoPopover() {
  return (
    <Popover>
      <PopoverTrigger>Filters</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <p>Filter options.</p>
          <PopoverClose>Done</PopoverClose>
          <button type="button">Extra field</button>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed initially', () => {
    render(<DemoPopover />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on trigger click and wires up role="dialog" with a matching id', () => {
    render(<DemoPopover />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    fireEvent.click(trigger);

    const content = screen.getByRole('dialog');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Non-modal: unlike Dialog, no aria-modal attribute.
    expect(content).not.toHaveAttribute('aria-modal');
  });

  it('trigger toggles: clicking it again while open closes it', () => {
    render(<DemoPopover />);
    const trigger = screen.getByRole('button', { name: 'Filters' });

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves focus into the content on open', async () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus();
    });
  });

  it('closes and restores focus to the trigger on Escape', async () => {
    render(<DemoPopover />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes via PopoverClose', async () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('is non-modal: FocusScope is not trapped, unlike Dialog', () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));

    const content = screen.getByRole('dialog');
    // `FocusScope`'s Tab-trap keydown listener is only registered when `trapped`
    // is true; a plain synthetic Tab keydown reaching here without being
    // intercepted (no `defaultPrevented`) is a reasonable proxy for "not trapped".
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    content.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
