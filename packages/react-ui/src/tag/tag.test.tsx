import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tag } from './tag';

describe('Tag (ui)', () => {
  it('defaults to the neutral color, outlined (border, no filled background)', () => {
    render(<Tag>Design</Tag>);
    const classes = screen.getByText('Design').className.split(' ');
    expect(classes).toContain('border-[var(--badge-neutral-bg)]');
    expect(classes).toContain('text-[var(--badge-neutral-bg)]');
    expect(classes).not.toContain('bg-[var(--badge-neutral-bg)]');
  });

  it('applies the requested color, still outlined', () => {
    render(<Tag color="danger">Failed</Tag>);
    const classes = screen.getByText('Failed').className.split(' ');
    expect(classes).toContain('border-[var(--badge-danger-bg)]');
    expect(classes).not.toContain('bg-[var(--badge-danger-bg)]');
  });

  it('renders as a span, not an interactive element', () => {
    render(<Tag>Static</Tag>);
    expect(screen.getByText('Static').tagName).toBe('SPAN');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tag color="info">Design</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
