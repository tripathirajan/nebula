import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Badge } from './badge';

describe('Badge (ui)', () => {
  it('defaults to the primary variant', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New').className).toContain('bg-[var(--badge-primary-bg)]');
  });

  it('applies the requested variant', () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText('Active').className).toContain('bg-[var(--badge-success-bg)]');
  });

  it('renders as a span, not an interactive element', () => {
    render(<Badge>Static</Badge>);
    expect(screen.getByText('Static').tagName).toBe('SPAN');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Badge variant="warning">3 pending</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
