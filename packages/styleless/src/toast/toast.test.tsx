import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Toast } from './toast';
import { ToastAction } from './toast-action';
import { ToastClose } from './toast-close';
import { ToastDescription } from './toast-description';
import { ToastTitle } from './toast-title';
import { ToastViewport } from './toast-viewport';

function DemoToast(props: { duration?: number; onOpenChange?: (open: boolean) => void }) {
  return (
    <ToastViewport>
      <Toast defaultOpen duration={props.duration} onOpenChange={props.onOpenChange}>
        <ToastTitle>Upload complete</ToastTitle>
        <ToastDescription>report.pdf was uploaded successfully.</ToastDescription>
        <ToastAction altText="Undo the upload">Undo</ToastAction>
        <ToastClose aria-label="Dismiss">×</ToastClose>
      </Toast>
    </ToastViewport>
  );
}

describe('Toast', () => {
  it('renders role="status" with aria-live="polite" and aria-atomic', () => {
    render(<DemoToast duration={Infinity} />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders inside a ToastViewport labelled "Notifications" by default', () => {
    render(<DemoToast duration={Infinity} />);
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('closes on ToastClose click', () => {
    render(<DemoToast duration={Infinity} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('ToastAction uses altText as its accessible name', () => {
    render(<DemoToast duration={Infinity} />);
    expect(screen.getByRole('button', { name: 'Undo the upload' })).toBeInTheDocument();
  });

  describe('auto-dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('auto-dismisses after duration elapses', () => {
      const onOpenChange = vi.fn();
      render(<DemoToast duration={1000} onOpenChange={onOpenChange} />);

      act(() => {
        vi.advanceTimersByTime(999);
      });
      expect(screen.getByRole('status')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('never auto-dismisses when duration is Infinity', () => {
      render(<DemoToast duration={Infinity} />);
      act(() => {
        vi.advanceTimersByTime(100_000);
      });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('pauses the countdown on pointer-enter and resumes the remaining time on pointer-leave', () => {
      const onOpenChange = vi.fn();
      render(<DemoToast duration={1000} onOpenChange={onOpenChange} />);
      const toast = screen.getByRole('status');

      act(() => {
        vi.advanceTimersByTime(800);
      });
      fireEvent.pointerEnter(toast);

      // Paused: waiting well past the original 1000ms deadline shouldn't fire.
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      fireEvent.pointerLeave(toast);
      // Only ~200ms should have been remaining when paused.
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('unmounts when open is set to false (controlled)', () => {
    const { rerender } = render(<DemoToast duration={Infinity} />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <ToastViewport>
        <Toast open={false} duration={Infinity}>
          <ToastTitle>Upload complete</ToastTitle>
        </Toast>
      </ToastViewport>,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    render(<DemoToast duration={Infinity} />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
