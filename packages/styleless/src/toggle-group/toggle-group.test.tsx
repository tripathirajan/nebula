import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ToggleGroup } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

function SingleGroup() {
  return (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Left">
        L
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center">
        C
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right">
        R
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function MultipleGroup() {
  return (
    <ToggleGroup type="multiple" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('renders role="group", not radiogroup, even in single mode', () => {
    render(<SingleGroup />);
    expect(screen.getByRole('group', { name: 'Text alignment' })).toBeInTheDocument();
  });

  it('single: respects defaultValue and only one item is pressed at a time', () => {
    render(<SingleGroup />);
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Center' }));
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('single: clicking the already-pressed item is a no-op (no collapsible escape hatch)', () => {
    render(<SingleGroup />);
    const left = screen.getByRole('button', { name: 'Left' });
    fireEvent.click(left);
    expect(left).toHaveAttribute('aria-pressed', 'true');
  });

  it('multiple: items press independently', () => {
    render(<MultipleGroup />);
    const bold = screen.getByRole('button', { name: 'Bold' });
    const italic = screen.getByRole('button', { name: 'Italic' });

    fireEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(italic);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'true');
  });

  it('multiple: clicking a pressed item unpresses it', () => {
    render(<MultipleGroup />);
    const bold = screen.getByRole('button', { name: 'Bold' });
    fireEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'false');
  });

  it('navigates items with ArrowRight/ArrowLeft (horizontal by default)', () => {
    render(<SingleGroup />);
    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });
    left.focus();

    fireEvent.keyDown(left, { key: 'ArrowRight' });
    expect(center).toHaveFocus();
  });

  it('disables every item when the group is disabled', () => {
    render(
      <ToggleGroup type="single" disabled aria-label="Text alignment">
        <ToggleGroupItem value="left" aria-label="Left">
          L
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole('button', { name: 'Left' })).toBeDisabled();
  });
});
