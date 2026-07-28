import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Select } from './select';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';
import { SelectPortal } from './select-portal';
import { SelectTrigger } from './select-trigger';
import { SelectValue } from './select-value';

import type { SelectItemProps } from './select-item';

function DemoSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

// Stands in for `@nebula-lab/react-ui`'s styled `SelectItem` — a `forwardRef`
// wrapper around the headless one, i.e. a *different* component reference
// than `SelectItem` itself. Every real consumer renders through a wrapper
// shaped like this, never the headless component directly.
const WrappedSelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>((props, ref) => (
  <SelectItem {...props} ref={ref} />
));
WrappedSelectItem.displayName = 'WrappedSelectItem';

function WrappedDemoSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <WrappedSelectItem value="apple">Apple</WrappedSelectItem>
          <WrappedSelectItem value="banana">Banana</WrappedSelectItem>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

describe('Select', () => {
  it('is closed initially and shows the placeholder', () => {
    render(<DemoSelect />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Pick a fruit');
  });

  it('opens on trigger click with aria-haspopup="listbox"', () => {
    render(<DemoSelect />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    // While closed, SelectContent is unmounted — aria-controls must be
    // omitted rather than pointing at a dangling id.
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', listbox.id);
  });

  it('selecting an item updates SelectValue and closes the popup', async () => {
    render(<DemoSelect />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(screen.getByRole('button')).toHaveTextContent('Banana');
  });

  it('calls onValueChange with the selected value', () => {
    const onValueChange = vi.fn();
    render(<DemoSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('respects defaultValue and displays its label immediately', () => {
    render(<DemoSelect defaultValue="apple" />);
    expect(screen.getByRole('button')).toHaveTextContent('Apple');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    render(<DemoSelect />);
    const trigger = screen.getByRole('button');
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('mirrors the value onto a visually-hidden native <select> when name is given', () => {
    const { container } = render(<DemoSelect name="fruit" defaultValue="apple" />);
    const nativeSelect = container.querySelector('select[name="fruit"]');
    expect(nativeSelect).not.toBeNull();
    expect((nativeSelect as HTMLSelectElement).value).toBe('apple');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoSelect />);
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('with a wrapped SelectItem (e.g. a styled component around the headless one)', () => {
    // Regression: `Select`'s static-label collection previously matched
    // items via `child.type === SelectItem` — true for the headless item
    // used directly (every test above), but false for any wrapper, since a
    // `forwardRef` wrapper is a different component reference. Every real
    // app renders through `@nebula-lab/react-ui`'s styled `SelectItem`
    // wrapper, never this headless one directly, so this was a real,
    // shipped bug: `SelectTrigger` fell back to its placeholder text the
    // instant the popup closed post-selection, even though the underlying
    // value was set correctly.
    it('keeps showing the selected label after the popup closes', async () => {
      render(<WrappedDemoSelect />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
      expect(screen.getByRole('button')).toHaveTextContent('Banana');
    });

    it('shows a defaultValue label immediately, before the item has ever mounted open', () => {
      render(<WrappedDemoSelect defaultValue="apple" />);
      expect(screen.getByRole('button')).toHaveTextContent('Apple');
    });
  });
});
