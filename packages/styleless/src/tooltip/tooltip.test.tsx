import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tooltip } from './tooltip';
import { TooltipContent } from './tooltip-content';
import { TooltipPortal } from './tooltip-portal';
import { TooltipTrigger } from './tooltip-trigger';

function DemoTooltip({ delayDuration }: { delayDuration?: number }) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Save your changes</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('is closed initially', () => {
    render(<DemoTooltip delayDuration={0} />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on pointer enter and wires up role="tooltip" with a matching id', async () => {
    render(<DemoTooltip delayDuration={0} />);
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);

    await waitFor(() => {
      const content = screen.getByRole('tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', content.id);
    });
  });

  it('closes immediately on pointer leave', async () => {
    render(<DemoTooltip delayDuration={0} />);
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('opens on focus and closes on blur', async () => {
    render(<DemoTooltip delayDuration={0} />);
    const trigger = screen.getByRole('button', { name: 'Save' });

    fireEvent.focus(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    fireEvent.blur(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    render(<DemoTooltip delayDuration={0} />);
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('does not reopen from the focus event produced by a click', async () => {
    render(<DemoTooltip delayDuration={0} />);
    const trigger = screen.getByRole('button', { name: 'Save' });

    // A real click fires pointerenter -> focus -> click in sequence; the
    // trailing click should suppress the tooltip the focus would otherwise
    // schedule/leave open.
    fireEvent.pointerEnter(trigger);
    fireEvent.focus(trigger);
    fireEvent.click(trigger);

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  describe('delayDuration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits delayDuration before opening', () => {
      render(<DemoTooltip delayDuration={300} />);
      const trigger = screen.getByRole('button', { name: 'Save' });

      fireEvent.pointerEnter(trigger);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Wrapped in `act()`: unlike `fireEvent.*`, `vi.advanceTimersByTime`
      // doesn't automatically flush the React state update the fired
      // `setTimeout` callback triggers (opening the tooltip).
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('cancels the pending open timer on pointer leave', () => {
      render(<DemoTooltip delayDuration={300} />);
      const trigger = screen.getByRole('button', { name: 'Save' });

      fireEvent.pointerEnter(trigger);
      fireEvent.pointerLeave(trigger);
      vi.advanceTimersByTime(300);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
