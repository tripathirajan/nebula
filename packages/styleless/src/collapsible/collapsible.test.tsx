import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Collapsible } from './collapsible';
import { CollapsibleContent } from './collapsible-content';
import { CollapsibleTrigger } from './collapsible-trigger';

import type { ComponentProps } from 'react';

function DemoCollapsible(props: ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible {...props}>
      <CollapsibleTrigger>Show more</CollapsibleTrigger>
      <CollapsibleContent>Extra detail.</CollapsibleContent>
    </Collapsible>
  );
}

describe('Collapsible', () => {
  it('is collapsed initially with aria-expanded="false" and hidden content', () => {
    render(<DemoCollapsible />);
    const trigger = screen.getByRole('button', { name: 'Show more' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Extra detail.')).not.toBeVisible();
  });

  it('expands on trigger click and wires up aria-controls to the content id', () => {
    render(<DemoCollapsible />);
    const trigger = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const content = screen.getByText('Extra detail.');
    expect(content).toBeVisible();
    expect(trigger).toHaveAttribute('aria-controls', content.id);
  });

  it('collapses again on a second click', () => {
    render(<DemoCollapsible />);
    const trigger = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Extra detail.')).not.toBeVisible();
  });

  it('respects defaultOpen', () => {
    render(<DemoCollapsible defaultOpen />);
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('is controllable via open/onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<DemoCollapsible open={false} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show more' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: stays closed since the consumer didn't update `open`.
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('does not expand when disabled', () => {
    render(<DemoCollapsible disabled />);
    const trigger = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toBeDisabled();
  });
});
