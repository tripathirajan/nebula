import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FocusItem } from './focus-item';
import { RovingFocusGroup } from './roving-focus-group';

import type { ComponentProps } from 'react';

function Toolbar(props: ComponentProps<typeof RovingFocusGroup>) {
  return (
    <RovingFocusGroup {...props}>
      <FocusItem asChild>
        <button>One</button>
      </FocusItem>
      <FocusItem asChild>
        <button>Two</button>
      </FocusItem>
      <FocusItem asChild>
        <button>Three</button>
      </FocusItem>
    </RovingFocusGroup>
  );
}

describe('RovingFocusGroup + FocusItem', () => {
  it('makes only the first-registered item a Tab stop initially', () => {
    render(<Toolbar />);
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Three' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus and the Tab stop to the next item on ArrowRight (horizontal, default)', () => {
    render(<Toolbar />);
    const one = screen.getByRole('button', { name: 'One' });
    const two = screen.getByRole('button', { name: 'Two' });

    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowRight' });

    expect(two).toHaveFocus();
    expect(two).toHaveAttribute('tabindex', '0');
    expect(one).toHaveAttribute('tabindex', '-1');
  });

  it('does not move past the last item when `loop` is false (the default)', () => {
    render(<Toolbar />);
    const three = screen.getByRole('button', { name: 'Three' });

    three.focus();
    fireEvent.keyDown(three, { key: 'ArrowRight' });

    expect(three).toHaveFocus();
  });

  it('wraps from the last item to the first when `loop` is true', () => {
    render(<Toolbar loop />);
    const one = screen.getByRole('button', { name: 'One' });
    const three = screen.getByRole('button', { name: 'Three' });

    three.focus();
    fireEvent.keyDown(three, { key: 'ArrowRight' });

    expect(one).toHaveFocus();
  });

  it('Home/End jump to the first/last item', () => {
    render(<Toolbar />);
    const one = screen.getByRole('button', { name: 'One' });
    const two = screen.getByRole('button', { name: 'Two' });
    const three = screen.getByRole('button', { name: 'Three' });

    two.focus();
    fireEvent.keyDown(two, { key: 'End' });
    expect(three).toHaveFocus();

    fireEvent.keyDown(three, { key: 'Home' });
    expect(one).toHaveFocus();
  });

  it('uses Up/Down instead of Left/Right when orientation is vertical', () => {
    render(<Toolbar orientation="vertical" />);
    const one = screen.getByRole('button', { name: 'One' });
    const two = screen.getByRole('button', { name: 'Two' });

    one.focus();
    // Horizontal keys shouldn't do anything in vertical orientation.
    fireEvent.keyDown(one, { key: 'ArrowRight' });
    expect(one).toHaveFocus();

    fireEvent.keyDown(one, { key: 'ArrowDown' });
    expect(two).toHaveFocus();
  });
});
