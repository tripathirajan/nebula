import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Chip } from './chip';

describe('Chip (ui)', () => {
  it('defaults to the neutral color', () => {
    render(<Chip>Filter</Chip>);
    expect(screen.getByText('Filter').className).toContain('bg-[var(--chip-neutral-bg)]');
  });

  it('applies the requested color', () => {
    render(<Chip color="danger">Failed</Chip>);
    expect(screen.getByText('Failed').className).toContain('bg-[var(--chip-danger-bg)]');
  });

  it('renders no dismiss button when onDismiss is omitted', () => {
    render(<Chip>Static</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Chip onDismiss={onDismiss} dismissLabel="Remove filter">
        Color: Blue
      </Chip>,
    );
    screen.getByRole('button', { name: 'Remove filter' }).click();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Chip color="info" onDismiss={() => {}} dismissLabel="Remove color filter">
        Color: Blue
      </Chip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
