import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardTrigger } from './hover-card-trigger';

function DemoHoverCard(props: { openDelay?: number; closeDelay?: number }) {
  return (
    <HoverCard openDelay={props.openDelay ?? 0} closeDelay={props.closeDelay ?? 0}>
      <HoverCardTrigger href="/u/jane">@jane</HoverCardTrigger>
      <HoverCardContent>Jane Doe — Product Designer</HoverCardContent>
    </HoverCard>
  );
}

describe('HoverCard', () => {
  it('is closed initially', () => {
    render(<DemoHoverCard />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on pointer enter and wires up aria-describedby', async () => {
    render(<DemoHoverCard />);
    const trigger = screen.getByRole('link', { name: '@jane' });
    fireEvent.pointerEnter(trigger);

    await waitFor(() => {
      const content = screen.getByRole('dialog');
      expect(trigger).toHaveAttribute('aria-describedby', content.id);
    });
  });

  it('closes on pointer leave (after closeDelay)', async () => {
    render(<DemoHoverCard />);
    const trigger = screen.getByRole('link', { name: '@jane' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opens on focus and closes on blur', async () => {
    render(<DemoHoverCard />);
    const trigger = screen.getByRole('link', { name: '@jane' });

    fireEvent.focus(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.blur(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    render(<DemoHoverCard />);
    const trigger = screen.getByRole('link', { name: '@jane' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('does not steal focus from an already-focused element on open', async () => {
    render(
      <div>
        <input aria-label="Search" />
        <DemoHoverCard />
      </div>,
    );
    const input = screen.getByRole('textbox', { name: 'Search' });
    input.focus();
    expect(input).toHaveFocus();

    fireEvent.pointerEnter(screen.getByRole('link', { name: '@jane' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(input).toHaveFocus();
  });

  describe('openDelay/closeDelay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits openDelay before opening', () => {
      render(<DemoHoverCard openDelay={300} closeDelay={300} />);
      const trigger = screen.getByRole('link', { name: '@jane' });

      fireEvent.pointerEnter(trigger);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('pointer entering the content cancels the pending close timer', () => {
      render(<DemoHoverCard openDelay={0} closeDelay={300} />);
      const trigger = screen.getByRole('link', { name: '@jane' });

      fireEvent.pointerEnter(trigger);
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.pointerLeave(trigger);
      fireEvent.pointerEnter(screen.getByRole('dialog'));

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('has no axe violations', async () => {
    render(<DemoHoverCard />);
    fireEvent.pointerEnter(screen.getByRole('link', { name: '@jane' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
