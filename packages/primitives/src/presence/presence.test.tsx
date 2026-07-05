import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Presence } from './presence';

describe('Presence', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children while present', () => {
    render(
      <Presence present>
        <div data-testid="content">Hello</div>
      </Presence>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('unmounts once present becomes false when no animation/transition is defined', async () => {
    const { rerender } = render(
      <Presence present>
        <div data-testid="content">Hello</div>
      </Presence>,
    );
    rerender(
      <Presence present={false}>
        <div data-testid="content">Hello</div>
      </Presence>,
    );
    await waitFor(() => expect(screen.queryByTestId('content')).not.toBeInTheDocument());
  });

  it('stays mounted until the exit animation finishes when one is defined', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'fade-out',
      animationDuration: '0.2s',
      transitionDuration: '0s',
      transitionProperty: 'none',
    } as unknown as CSSStyleDeclaration);

    const { rerender } = render(
      <Presence present>
        <div data-testid="content">Hello</div>
      </Presence>,
    );
    rerender(
      <Presence present={false}>
        <div data-testid="content">Hello</div>
      </Presence>,
    );

    // Still present immediately after present -> false; the animation hasn't
    // fired `animationend` yet.
    expect(screen.getByTestId('content')).toBeInTheDocument();

    act(() => {
      screen.getByTestId('content').dispatchEvent(new Event('animationend'));
    });

    await waitFor(() => expect(screen.queryByTestId('content')).not.toBeInTheDocument());
  });

  it('honors prefers-reduced-motion by skipping the animation wait entirely (WCAG 2.3.3)', async () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'fade-out',
      animationDuration: '0.2s',
      transitionDuration: '0s',
      transitionProperty: 'none',
    } as unknown as CSSStyleDeclaration);
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );

    const { rerender } = render(
      <Presence present>
        <div data-testid="content">Hello</div>
      </Presence>,
    );
    rerender(
      <Presence present={false}>
        <div data-testid="content">Hello</div>
      </Presence>,
    );

    // No `animationend` dispatched — reduced motion means it unmounts right away.
    await waitFor(() => expect(screen.queryByTestId('content')).not.toBeInTheDocument());
  });
});
