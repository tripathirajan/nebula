import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

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
        {/* `aria-label` here, not in `PopoverContent` itself: unlike
            `Dialog` (which wires `aria-labelledby` to a `DialogTitle`
            automatically), `Popover` has no title sub-component, so an
            accessible name is on the consumer to supply — same as a real
            `role="dialog"` with no visible heading always needs. */}
        <PopoverContent aria-label="Filters">
          <p>Filter options.</p>
          <PopoverClose>Done</PopoverClose>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

describe('Popover (ui)', () => {
  it('opens on trigger click and renders the styled content', () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));

    expect(screen.getByRole('dialog').className).toContain('bg-[var(--popover-content-bg)]');
  });

  it('closes via PopoverClose', async () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    await waitFor(() => screen.getByRole('dialog'));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
